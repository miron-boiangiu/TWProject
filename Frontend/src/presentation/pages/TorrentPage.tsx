import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo, useCallback, useState } from "react";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Seo } from "@presentation/components/ui/Seo";
import { useMatch } from "react-router-dom";
import { useGetTorrent } from "@infrastructure/apis/api-management/useTorrent";
import { useDeleteComment, useGetComments, useUpdateComment } from "@infrastructure/apis/api-management/useComment";
import { useNavigate } from "react-router-dom";
import {
  useAddLike,
  useRemoveLike,
  useCheckLike
} from "@infrastructure/apis/api-management/useLike";
import { useDownloadUserFile } from "@infrastructure/apis/api-management";
import { downloadDocument } from "@infrastructure/utils/downloadUtils";
import { current } from "@reduxjs/toolkit";
import { useOwnUser, useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { useDeleteTorrent } from "@infrastructure/apis/api-management/useTorrent";
import { UserRoleEnum } from "@infrastructure/apis/client";

export const TorrentPage = memo(() => {
    const [showDeleteTorrentDialog, setShowDeleteTorrentDialog] = useState(false);
    const deleteTorrent = useDeleteTorrent();
    const { mutateAsync: download } = useDownloadUserFile(); // Use the API hook.
    const downloadUserFile = useCallback((file2?: any) => download(file2.id ?? '')
            .then((file) => downloadDocument(file, file2.name ?? '')), [download]); // Create the callback to download the user file.

    const ownUser = useOwnUser();
    const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);

    const navigate = useNavigate();
    const match = useMatch("/view-torrent/:id");
    const torrentId = match?.params.id ?? null;

    const checkLike = useCheckLike(torrentId ?? "");
    const addLike = useAddLike();
    const removeLike = useRemoveLike();

    const hasLiked = checkLike.data?.response?.isLiked ?? false;

    const toggleLike = () => {
    if (!torrentId) return;

    if (hasLiked) {
        removeLike.mutate(torrentId);
    } else {
        addLike.mutate(torrentId);
    }
    };

    const currentTorrent = useGetTorrent(torrentId);
    
    const COMMENTS_PER_PAGE = 5;
    const [page, setPage] = useState(0);
    const [editingComment, setEditingComment] = useState<null | { id: string, text: string }>(null);

    const commentData = useGetComments(torrentId ?? "", page + 1, COMMENTS_PER_PAGE);
    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    const comments = commentData.data?.response?.data ?? [];
    const totalCount = commentData.data?.response?.totalCount ?? 0;
    const totalPages = Math.ceil(totalCount / COMMENTS_PER_PAGE);

    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        deleteComment.mutate(id);
        console.log("Delete", id);
    };

    const handleEdit = (id: string, currentText: string) => {
        setEditingComment({ id, text: currentText });
    };

    const handleEditSave = () => {
        updateComment.mutate({
            id: editingComment!.id,
            text: editingComment?.text
        });
        setEditingComment(null);
    };

    const handleEditCancel = () => {
        setEditingComment(null);
    };

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const fileData = {
        name: currentTorrent.data?.response?.name ?? "Loading...",
        description: currentTorrent.data?.response?.description ?? "No description.",
    };

    return (
        <Fragment>
            <Seo title="MobyLab Web App | Torrent" />
            <WebsiteLayout viewingTorrent={true} text="Viewing Torrent">
                <Box sx={{ padding: "30px 50px" }}>
                    
                        <Button variant="text" onClick={() => downloadUserFile({id: currentTorrent.data?.response?.id, name: currentTorrent.data?.response?.name})}><Typography variant="h4" gutterBottom>{fileData.name}{" "}<CloudDownloadIcon color="primary" fontSize='large' /></Typography></Button>
                    
                        <Stack direction="row" spacing={2} alignItems="center" mt={1} mb={2}>
                        <Button
                            variant={hasLiked ? "contained" : "outlined"}
                            color="primary"
                            onClick={toggleLike}
                            disabled={checkLike.isLoading || addLike.isPending || removeLike.isPending}
                        >
                            {hasLiked ? "Unlike" : "Like"}
                        </Button>

                        { (ownUser?.id === currentTorrent.data?.response?.user?.id || isAdmin) && (
                            <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setShowDeleteTorrentDialog(true)}
                            >
                            Remove Torrent
                            </Button>
                        )}
                        </Stack>

                    <Paper sx={{ padding: 2, marginBottom: 4 }}>
                        <Typography variant="body1">
                            {fileData.description}
                        </Typography>
                    </Paper>

                    <Typography variant="h5" gutterBottom>
                        Comments
                    </Typography>
                    <Paper sx={{ padding: 2 }}>
                        {commentData.isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Stack direction="row" justifyContent="flex-end" mb={2}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/add-comment/${torrentId}`)}
                                        >
                                            Add Comment
                                        </Button>
                                    </Stack>
                                <List>
                                    {comments.map((comment, index) => (
                                        <Fragment key={comment.id}>
                                            <ListItem
                                                alignItems="flex-start"
                                                secondaryAction={
                                                    <Stack direction="row" spacing={1}>

                                                        { (ownUser?.id === comment.user.id || isAdmin) &&
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => handleEdit(comment.id, comment.text)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                }

                                                    { (ownUser?.id === comment.user.id || isAdmin) &&
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => setDeletingCommentId(comment.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>}


                                                    </Stack>
                                                }
                                            >
                                                <ListItemText
                                                    primary={comment.user?.name ?? "Anonymous"}
                                                    secondary={comment.text}
                                                />
                                            </ListItem>
                                            {index < comments.length - 1 && <Divider />}
                                        </Fragment>
                                    ))}
                                </List>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={handlePrev}
                                        disabled={page === 0}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={page >= totalPages - 1}
                                    >
                                        Next
                                    </Button>
                                </Stack>
                                <Typography variant="caption" display="block" mt={1} textAlign="right">
                                    Page {page + 1} of {totalPages}
                                </Typography>
                            </>
                        )}
                    </Paper>

                    {/* Edit Modal */}
                    <Dialog
                        open={editingComment !== null}
                        onClose={handleEditCancel}
                        fullWidth
                        maxWidth="sm"
                    >
                        <DialogTitle>Edit Comment</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                value={editingComment?.text || ""}
                                onChange={(e) =>
                                    setEditingComment((prev) =>
                                        prev ? { ...prev, text: e.target.value } : prev
                                    )
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditCancel}>Cancel</Button>
                            <Button variant="contained" onClick={handleEditSave}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>


                    <Dialog
                        open={!!deletingCommentId}
                        onClose={() => setDeletingCommentId(null)}
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete this comment? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeletingCommentId(null)}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    if (deletingCommentId) {
                                        deleteComment.mutate(deletingCommentId);
                                        setDeletingCommentId(null);
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={showDeleteTorrentDialog}
                        onClose={() => setShowDeleteTorrentDialog(false)}
                        fullWidth
                        maxWidth="xs"
                        >
                        <DialogTitle>Confirm Torrent Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>
                            Are you sure you want to delete this torrent? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowDeleteTorrentDialog(false)}>
                            Cancel
                            </Button>
                            <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                if (torrentId) {
                                deleteTorrent.mutate(torrentId, {
                                    onSuccess: () => navigate("/") // Redirect or refresh list
                                });
                                navigate("/user-files/")
                                setShowDeleteTorrentDialog(false);
                                }
                            }}
                            >
                            Delete
                            </Button>
                        </DialogActions>
                        </Dialog>
                </Box>
            </WebsiteLayout>
        </Fragment>
    );
});