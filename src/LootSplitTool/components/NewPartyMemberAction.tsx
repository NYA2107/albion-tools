import { UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useState } from "react";

interface PropTypes {
  onAddNewMember: (newMember: string[]) => void;
}

const NewPartyMemberAction: FC<PropTypes> = (props) => {
  const { onAddNewMember } = props;
  const [memberText, setMemberText] = useState<string>("");

  const handleChangeMemberText = (newMemberText: string) => {
    setMemberText(newMemberText);
  };

  const handleAddNewMember = () => {
    const newMembers: string[] = memberText.split("\n");
    setMemberText("");
    onAddNewMember(newMembers);
  };

  return (
    <Space direction="vertical" style={{ width: "500px" }}>
      <Typography.Text>Members</Typography.Text>
      <TextArea
        placeholder="Input members name, enter new line to add more"
        rows={3}
        value={memberText}
        onChange={(e) => handleChangeMemberText(e.target.value)}
      />
      <Button
        type="primary"
        icon={<UsergroupAddOutlined />}
        style={{ margin: "5px" }}
        onClick={handleAddNewMember}
      >
        Add New Party Member
      </Button>
    </Space>
  );
};

export default NewPartyMemberAction;
