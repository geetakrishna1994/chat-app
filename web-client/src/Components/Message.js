import styled from "styled-components";
import { forwardRef } from "react";

const Message = forwardRef(({ own }, ref) => {
  return (
    <MessageContainer own={own} ref={ref}>
      <span className="content">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione nulla
        ipsam eius, dolore repudiandae dicta iure iste eum doloremque. Sapiente
        reiciendis cupiditate illum. Debitis voluptatum doloribus aperiam vero?
        Reprehenderit, id. dasfasagas fasfasfggf afsagag fsafgasgag dasfnsanf
        asfnsafna asnfasjnfa sfnsfsd asnfasf faf fafawe fe
      </span>
      <span className="meta">
        <span>11:06 pm</span>
        <span>Read</span>
      </span>
    </MessageContainer>
  );
});

export default Message;

const MessageContainer = styled.div`
  width: fit-content;
  padding: 5px;
  background-color: ${(props) => (props.own ? "#065051" : "#262D31")};
  color: white;
  align-self: ${(props) => (props.own ? "flex-end" : "flex-start")};
  max-width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  & .content {
    align-self: flex-start;
  }
  & .meta {
    align-self: flex-end;
    font-size: 0.6rem;
  }
`;
