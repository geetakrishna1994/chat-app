import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import { useSelector } from "react-redux";
const MessageStatus = ({ message }) => {
  const convoIndex = useSelector((state) =>
    state.conversations.conversations.findIndex(
      (c) => c.conversationId._id === message.conversationId
    )
  );

  const numOfUsers = useSelector(
    (state) =>
      state.conversations.conversations[convoIndex].conversationId.users.length
  );

  const read = message.readBy?.length === numOfUsers - 1;
  const delivered = message.deliveredTo?.length === numOfUsers - 1;
  const sent = message.status === "sent";
  const pending = message.status === "pending";

  if (read)
    return (
      <div>
        <DoneAllIcon style={{ color: "blue", fontSize: "16px" }} />
      </div>
    );
  else if (delivered)
    return (
      <div>
        <DoneAllIcon style={{ fontSize: "16px" }} />
      </div>
    );
  else if (sent)
    return (
      <div>
        <DoneIcon style={{ fontSize: "16px" }} />
      </div>
    );
  else if (pending)
    return (
      <div>
        <QueryBuilderIcon style={{ fontSize: "16px" }} />
      </div>
    );
  else
    return (
      <div>
        <DoneAllIcon style={{ color: "blue" }} />
      </div>
    );
};

export default MessageStatus;
