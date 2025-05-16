import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { generateInvitationDialogController } from "./GenerateInvitationDialog.controller";
import { UserAddForm } from "@presentation/components/forms/User/UserAddForm";
import { useIntl } from "react-intl";
import { useGenerateInvitation } from "@infrastructure/apis/api-management/useInvitation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * This component wraps the user add form into a modal dialog.
 */
export const GenerateInvitationDialog = () => {
  const { open, close, isOpen } = generateInvitationDialogController();
  const { formatMessage } = useIntl();
  const [message, setMessage] = useState("Generating new invitation key...");

  const { mutateAsync: add, status } = useGenerateInvitation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    onGenerate();
  }, [isOpen])

  const onGenerate = async () => {
    let newInvitation = await add();
    setMessage(newInvitation.response?.id ?? "Failed to generate new invitation key.")
  }

  return <div>
    <Button variant="outlined" onClick={open}>
      Generate Invitation
    </Button>
    <Dialog
      open={isOpen}
      onClose={close}>
      <DialogTitle>
        Invitation generated
      </DialogTitle>
      <DialogContent>
        Your invitation key is: {message}
      </DialogContent>
    </Dialog>
  </div>
};