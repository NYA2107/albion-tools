import { PercentageOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  InputNumber,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { FC, useState } from "react";

interface PropTypes {
  onAddLootReducer: (
    name: string,
    type: "percentage" | "exact-value",
    value: number
  ) => void;
}

const ReducerAction: FC<PropTypes> = (props) => {
  const { onAddLootReducer } = props;
  const [reducerName, setReducerName] = useState<string>("");
  const [reducerType, setReducerType] = useState<"percentage" | "exact-value">(
    "percentage"
  );
  const [reducerValue, setReducerValue] = useState<number>(0);

  const handleAddLootReducer = () => {
    setReducerName("");
    setReducerType("percentage");
    setReducerValue(0);
    onAddLootReducer(reducerName, reducerType, reducerValue);
  };

  return (
    <Space direction="vertical">
      <div>
        <Typography.Text>Reducer Name</Typography.Text>
        <div>
          <Input
            placeholder="Input reducer name"
            value={reducerName}
            onChange={(e) => setReducerName(e.target.value)}
            style={{ width: "500px" }}
          />
        </div>
      </div>
      <div>
        <Typography.Text>Reducer Type</Typography.Text>
        <div>
          <Select
            value={reducerType}
            options={[
              { label: "Percentage", value: "percentage" },
              { label: "Exact Value", value: "exact-value" },
            ]}
            onChange={(value) => setReducerType(value)}
            style={{ width: "500px" }}
          />
        </div>
      </div>
      <div>
        <Typography.Text>Value</Typography.Text>
        <div>
          <Tooltip
            title={`${new Intl.NumberFormat("id-ID").format(reducerValue)}`}
            trigger="focus"
          >
            <InputNumber
              value={reducerValue}
              onChange={(value) => setReducerValue(value || 0)}
              style={{ width: "500px" }}
            />
          </Tooltip>
        </div>
      </div>
      <Button
        icon={<PercentageOutlined />}
        type="primary"
        style={{ margin: "5px" }}
        onClick={handleAddLootReducer}
      >
        Add Loot Reducer
      </Button>
    </Space>
  );
};

export default ReducerAction;
