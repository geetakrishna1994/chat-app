import styled from "styled-components";

const Avatar = (props) => {
  return <StyledImage {...props} />;
};

export default Avatar;

const StyledImage = styled.img.attrs((props) => ({
  size: props.size || "40px",
  mr: props.mr || 0,
}))`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  border-radius: 50%;
  object-fit: cover;
  margin-right: ${(props) => props.mr};
  cursor: pointer;
`;
