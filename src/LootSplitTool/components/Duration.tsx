import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import moment from "moment";
import { FC } from "react";
import MomentDatePicker from "../../Global/components/MomentDatePicker";

export interface LogType {
  id: number;
  date: string;
}

interface DurationProps {
  onDurationChange?: (duration: number) => void;
  onLogsChange?: (logs: LogType[]) => void;
  value: LogType[];
}

const Duration: FC<DurationProps> = (props) => {
  const { onDurationChange, onLogsChange, value } = props;
  const logs = value || [];

  console.log(logs, "LOGS");
  const calculateDuration = (logs: LogType[]) => {
    let duration = 0;
    let inTime: string = "";
    logs.map((v, i) => {
      if (i % 2 === 0) {
        inTime = v.date;
      } else {
        //selisih in time dan current date
        console.log(
          moment(inTime).format("DD MM YYYY HH:mm:ss"),
          moment(v.date).format("DD MM YYYY HH:mm:ss"),
          moment(v.date).diff(inTime, "second"),
          "AA"
        );
        duration = duration + moment(v.date).diff(inTime, "second");
      }
    });
    onDurationChange && onDurationChange(duration);
  };

  const handleClickPlus = () => {
    const temp = JSON.parse(JSON.stringify(value));
    temp.push({
      id: Math.random(),
      date: moment().toISOString(),
    });
    calculateDuration(temp);
    onLogsChange && onLogsChange(temp);
  };

  const handleClickRemove = (id: number) => {
    let temp: LogType[] = JSON.parse(JSON.stringify(logs));
    temp = temp.filter((v) => v.id !== id);
    calculateDuration(temp);
    onLogsChange && onLogsChange(temp);
  };

  const handleChangeTime = (id: number, value: string) => {
    const temp: LogType[] = JSON.parse(JSON.stringify(logs));
    const index = temp.findIndex((v) => v.id === id);
    temp[index].date = value;
    calculateDuration(temp);
    onLogsChange && onLogsChange(temp);
  };

  return (
    <div>
      <Space direction="vertical">
        {logs.map((v, i) => {
          return (
            <Space>
              <div style={{ width: "40px" }}>
                {i % 2 == 0 ? (
                  <Typography.Text type="success">IN</Typography.Text>
                ) : (
                  <Typography.Text type="danger">OUT</Typography.Text>
                )}
              </div>
              <MomentDatePicker
                value={moment(v.date)}
                showTime
                onChange={(value) =>
                  handleChangeTime(v.id, moment(value).toISOString())
                }
              />
              <Button
                onClick={() => handleClickRemove(v.id)}
                type="link"
                danger
                icon={<DeleteOutlined />}
              />
            </Space>
          );
        })}
      </Space>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "1em",
        }}
      >
        <Button
          onClick={() => handleClickPlus()}
          type="link"
          icon={<PlusCircleOutlined />}
        />
      </div>
    </div>
  );
};

export default Duration;
