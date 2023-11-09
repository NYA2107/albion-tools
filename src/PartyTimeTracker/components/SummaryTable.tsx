import { Button, Space, Table, Typography } from "antd";
import Search from "antd/es/input/Search";
import { FC } from "react";
import { MemberType } from "..";

interface PropTypes {
  memberList: MemberType[];
  onClickRefreshCalculation: () => void;
  textSearch: string;
  onSearch: (text: string) => void;
  onSearchChange: (text: string) => void;
}

const SummaryTable: FC<PropTypes> = (props) => {
  const {
    memberList,
    onClickRefreshCalculation,
    textSearch,
    onSearch,
    onSearchChange,
  } = props;
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size={15}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div>
            <Search
              placeholder="Search Member"
              allowClear
              value={textSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              onSearch={(value) => onSearch(value)}
              style={{ width: 200 }}
            />
          </div>
          <Button type="primary" onClick={onClickRefreshCalculation}>
            Refresh Calculation
          </Button>
        </div>
        <Table
          columns={[
            { key: "no", title: "No", dataIndex: "no", width: 60 },
            { key: "name", title: "Name", dataIndex: "name" },
            {
              key: "current-status",
              title: "Current Status",
              dataIndex: "currentStatus",
              width: 200,
            },
            {
              key: "time-played",
              title: "Time Played",
              dataIndex: "timePlayed",
              width: 300,
              render: (text) => {
                const hours = Math.floor(text / 3600);
                const minutes = Math.floor((text % 3600) / 60);
                const seconds = Math.floor(text % 60);
                return (
                  <Typography.Text>
                    {hours}:{minutes}:{seconds}
                  </Typography.Text>
                );
              },
            },
            {
              key: "loot-percentage",
              title: "Loot Percentage",
              dataIndex: "splitPercentage",
              width: 300,
              render: (text) => <Typography.Text>{text} %</Typography.Text>,
            },
          ]}
          dataSource={memberList}
        />
      </Space>
    </div>
  );
};

export default SummaryTable;
