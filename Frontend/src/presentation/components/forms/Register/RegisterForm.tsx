import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    OutlinedInput,
    Stack
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { isEmpty, isUndefined } from "lodash";
import { useRegisterFormController } from "./RegisterForm.controller";

export const RegisterForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useRegisterFormController();

    return (
        <form className="min-w-[400px]" onSubmit={actions.handleSubmit(actions.submit)}>
            <Stack spacing={4} style={{ width: "100%" }}>
                <ContentCard title={formatMessage({ id: "globals.register" })}>
                    <div className="grid grid-cols-2 gap-y-5 gap-x-5">

                        {/* Name */}
                        <div className="col-span-2">
                            <FormControl fullWidth error={!isUndefined(state.errors.name)}>
                                <FormLabel required>
                                    <FormattedMessage id="globals.name" />
                                </FormLabel>
                                <OutlinedInput
                                    {...actions.register("name")}
                                    placeholder={formatMessage(
                                        { id: "globals.placeholders.textInput" },
                                        { fieldName: formatMessage({ id: "globals.name" }) }
                                    )}
                                />
                                <FormHelperText hidden={isUndefined(state.errors.name)}>
                                    {state.errors.name?.message}
                                </FormHelperText>
                            </FormControl>
                        </div>

                        {/* Email */}
                        <div className="col-span-2">
                            <FormControl fullWidth error={!isUndefined(state.errors.email)}>
                                <FormLabel required>
                                    <FormattedMessage id="globals.email" />
                                </FormLabel>
                                <OutlinedInput
                                    {...actions.register("email")}
                                    placeholder={formatMessage(
                                        { id: "globals.placeholders.textInput" },
                                        { fieldName: formatMessage({ id: "globals.email" }) }
                                    )}
                                    autoComplete="username"
                                />
                                <FormHelperText hidden={isUndefined(state.errors.email)}>
                                    {state.errors.email?.message}
                                </FormHelperText>
                            </FormControl>
                        </div>

                        {/* Password */}
                        <div className="col-span-2">
                            <FormControl fullWidth error={!isUndefined(state.errors.password)}>
                                <FormLabel required>
                                    <FormattedMessage id="globals.password" />
                                </FormLabel>
                                <OutlinedInput
                                    type="password"
                                    {...actions.register("password")}
                                    placeholder={formatMessage(
                                        { id: "globals.placeholders.textInput" },
                                        { fieldName: formatMessage({ id: "globals.password" }) }
                                    )}
                                    autoComplete="new-password"
                                />
                                <FormHelperText hidden={isUndefined(state.errors.password)}>
                                    {state.errors.password?.message}
                                </FormHelperText>
                            </FormControl>
                        </div>

                        {/* Confirm Password */}
                        <div className="col-span-2">
                            <FormControl fullWidth error={!isUndefined(state.errors.confirmPassword)}>
                                <FormLabel required>
                                    <FormattedMessage id="globals.confirmPassword" defaultMessage="Confirm Password" />
                                </FormLabel>
                                <OutlinedInput
                                    type="password"
                                    {...actions.register("confirmPassword")}
                                    placeholder={"Please repeat password"}
                                />
                                <FormHelperText hidden={isUndefined(state.errors.confirmPassword)}>
                                    {state.errors.confirmPassword?.message}
                                </FormHelperText>
                            </FormControl>
                        </div>

                        {/* Invitation */}
                        <div className="col-span-2">
                            <FormControl fullWidth error={!isUndefined(state.errors.invitation)}>
                                <FormLabel required>
                                    <FormattedMessage id="globals.invitation" defaultMessage="Invitation Code" />
                                </FormLabel>
                                <OutlinedInput
                                    {...actions.register("invitation")}
                                    placeholder={"Please input your invite code"}
                                />
                                <FormHelperText hidden={isUndefined(state.errors.invitation)}>
                                    {state.errors.invitation?.message}
                                </FormHelperText>
                            </FormControl>
                        </div>

                        {/* Submit */}
                        <Button className="-col-end-1 col-span-1" type="submit" disabled={!isEmpty(state.errors) || computed.isSubmitting}>
                            {!computed.isSubmitting && <FormattedMessage id="globals.submit" />}
                            {computed.isSubmitting && <CircularProgress />}
                        </Button>
                    </div>
                </ContentCard>
            </Stack>
        </form>
    );
};
