import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo } from "react";
import { Box } from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { LoginForm } from "@presentation/components/forms/Login/LoginForm";
import { RegisterForm } from "@presentation/components/forms/Register/RegisterForm";

export const RegisterPage = memo(() => {
    return <Fragment>
        <Seo title="MobyLab Web App | Login" />
        <WebsiteLayout>
            <Box sx={{ padding: "0px 50px 0px 50px", justifyItems: "center" }}>
                <RegisterForm />
            </Box>
        </WebsiteLayout>
    </Fragment>
});
