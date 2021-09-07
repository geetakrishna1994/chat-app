import styled from "styled-components";
import Avatar from "./Avatar";
const Conversation = () => {
  return (
    <ConversationContainer>
      <Avatar
        src="https://images.unsplash.com/photo-1630261234647-ac2d4b955f59?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
        size="50px"
        mr="10px"
      />
      <RightContainer>
        <div>
          <span className="name">Regina Phelange</span>
          <span className="time">9:00</span>
          <span className="message">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab id eos,
            rerum mollitia voluptas labore delectus omnis voluptates quos nulla
            similique nobis porro consectetur aperiam! A quam est consectetur
            expedita!
          </span>
          <span className="count">1</span>
        </div>
      </RightContainer>
    </ConversationContainer>
  );
};

export default Conversation;

const ConversationContainer = styled.div`
  height: 70px;
  width: 100%;
  background-color: #131c21;
  align-items: center;
  display: flex;
  padding: 0 5px;
  flex-shrink: 0;

  &:hover {
    background-color: #2d3134;
    cursor: pointer;
  }
`;

const RightContainer = styled.div`
  flex: 1;
  height: 100%;
  border-bottom: 1px solid #242d32;
  color: #b1b3b5;
  display: flex;
  align-items: center;

  & > div {
    flex: 1;
    display: grid;
    grid-template-columns: 80% 20%;
    grid-template-rows: 20px 20px;
    grid-row-gap: 5px;
  }
  & .name {
    color: white;
    text-transform: capitalize;
  }

  & .time {
    color: #00af9c;
    text-align: center;
    justify-self: center;
  }

  & .message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-style: italic;
    font-size: 0.8rem;
  }

  & .count {
    padding: 1px;
    background-color: #00af9c;
    border-radius: 15px;
    color: black;
    width: fit-content;
    min-width: 20px;
    text-align: center;
    justify-self: center;
    align-self: center;
    font-size: 0.75rem;
  }
`;
