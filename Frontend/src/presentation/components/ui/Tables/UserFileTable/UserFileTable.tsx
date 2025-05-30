import { useIntl } from "react-intl";
import { isUndefined } from "lodash";
import { Box, IconButton, TablePagination, TextField } from "@mui/material";
import { DataLoadingContainer } from "../../LoadingDisplay";
import { useUserFileTableController } from "./UserFileTable.controller";
import { UserFileDTO } from "@infrastructure/apis/client";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LoupeIcon from '@mui/icons-material/Loupe';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { dateToDateStringOrNull } from "@infrastructure/utils/dateUtils";
import { UserFileAddDialog } from "../../Dialogs/UserFileAddDialog";
import {DataTable, DataTableHeader} from "@presentation/components/ui/Tables/DataTable";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "routes";
import { useState } from "react";

/**
 * This hook returns a header for the table with translated columns.
 */
const useHeader = (): DataTableHeader<UserFileDTO> => {
    const { formatMessage } = useIntl();

    return [
        //{ key: "name", name: formatMessage({ id: "globals.name" }), order: 1, render: value => <span>{value.name}</span>  } ,
        { key: "description", name: formatMessage({ id: "globals.description" }), order: 2 },
        //For some values there may need to have special renders, you can use a map of render functions.
        { key: "user", name: formatMessage({ id: "globals.addBy" }), order: 3, render: value => <span>{value.name}</span> },
        { key: "createdAt", name: formatMessage({ id: "globals.createdAt" }), order: 4, render: value => <span>{dateToDateStringOrNull(value)}</span> }
    ]
};

/**
 * Creates the user file table.
 */
export const UserFileTable = () => {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const header = useHeader();
    const [searchTerm, setSearchTerm] = useState("");
    const { handleChangePage, handleChangePageSize, pagedData, isError, isLoading, tryReload, labelDisplay, downloadUserFile, openUserFile } = useUserFileTableController(searchTerm); // Use the controller hook.

    return <DataLoadingContainer isError={isError} isLoading={isLoading} tryReload={tryReload}> {/* Wrap the table into the loading container because data will be fetched from the backend and is not immediately available.*/}
        <UserFileAddDialog />  {/* Add the button to open the user file add modal. */}
        {!isUndefined(pagedData) && !isUndefined(pagedData?.totalCount) && !isUndefined(pagedData?.page) && !isUndefined(pagedData?.pageSize) &&
            <TablePagination // Use the table pagination to add the navigation between the table pages.
                component="div"
                count={pagedData.totalCount} // Set the entry count returned from the backend.
                page={pagedData.totalCount !== 0 ? pagedData.page - 1 : 0} // Set the current page you are on.
                onPageChange={handleChangePage} // Set the callback to change the current page.
                rowsPerPage={pagedData.pageSize} // Set the current page size.
                onRowsPerPageChange={handleChangePageSize}
                labelRowsPerPage={formatMessage({ id: "labels.itemsPerPage" })}
                labelDisplayedRows={labelDisplay} // Set the callback to change the current page size. 
                showFirstButton
                showLastButton
            />}

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
            <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    tryReload();
                }}
            />
        </Box>

        <DataTable data={pagedData?.data ?? []}
                   header={header}
                   extraHeader={[
                    { key: "name", name: formatMessage({ id: "globals.name" }), order: 1, render: value => <Link to={AppRoute.Torrent.replace(":id", value.id)}><span>{value.name}</span></Link>},
                    { key: "likes", name: "Likes", order: 4, render: value => <span>{value.likes}</span>},                    
                    {
                       key: "actions",
                       name: formatMessage({ id: "labels.actions" }),
                       render: entry => <> {/* Add other cells like action buttons. */}

                           {<IconButton color="primary" onClick={() => navigate(AppRoute.Torrent.replace(":id", entry.id))}>
                               <LoupeIcon color="primary" fontSize='small' />
                           </IconButton>}

                        {/* <Link style={{color: 'white'}} to={AppRoute.UserFiles}></Link> */}
                           {/* {<IconButton color="primary" onClick={() => downloadUserFile(entry)}>
                               <CloudDownloadIcon color="primary" fontSize='small' />
                           </IconButton>} */}
                           {entry.name?.endsWith(".pdf") && <IconButton color="primary" onClick={() => openUserFile(entry)}>
                               <FileOpenIcon color="primary" fontSize='small' />
                           </IconButton>}</>,
                       order: 5
                   }]}
        />
    </DataLoadingContainer >
}