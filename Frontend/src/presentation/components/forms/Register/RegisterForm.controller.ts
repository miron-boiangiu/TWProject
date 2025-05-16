import * as yup from "yup";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddUser } from "@infrastructure/apis/api-management";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useAppRouter } from "@infrastructure/hooks/useAppRouter";
import { RegisterFormController, RegisterFormModel } from "./RegisterForm.types";
import { UserRoleEnum } from "@infrastructure/apis/client";
import { useNavigate } from "react-router-dom";

const getDefaultValues = (): RegisterFormModel => ({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    invitation: ""
});

export const useRegisterFormController = (): RegisterFormController => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const { mutateAsync: addUser, status } = useAddUser();

    const schema = yup.object().shape({
        name: yup.string().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.name" }) })),
        email: yup.string().email().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.email" }) })),
        password: yup.string().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.password" }) })),
        confirmPassword: yup.string()
            .oneOf([yup.ref("password"), undefined], formatMessage({ id: "globals.validations.passwordMatch" }))
            .required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.confirmPassword" }) })),
        invitation: yup.string().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.invitation" }) }))
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormModel>({
        defaultValues: getDefaultValues(),
        resolver: yupResolver(schema)
    });

    const submit = useCallback((data: RegisterFormModel) => {
        const { confirmPassword, invitation, ...userAddDTO } = data;
        return addUser({...userAddDTO, role: UserRoleEnum.Client, invitationCode: invitation}).then(() => {
            toast(formatMessage({ id: "notifications.messages.registrationSuccess" }));
            navigate("/login");
        });
    }, [addUser, formatMessage, navigate]);

    return {
        actions: { register, handleSubmit, submit },
        state: { errors },
        computed: { defaultValues: getDefaultValues(), isSubmitting: status === "pending" }
    };
};
