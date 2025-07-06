import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { Button, InputNumber, Tooltip } from "antd";
import _ from "lodash";
import { FC, useEffect, useState } from "react";

export interface LootDataType {
  id: string;
  total: number;
}

export interface TotalLootPropsType {
  totalLoot: number;
  onTotalLootChange: (value: number) => void;
}

const TotalLoot: FC<TotalLootPropsType> = (props) => {
  const { totalLoot, onTotalLootChange } = props;
  const [loot, setLoot] = useState<LootDataType[]>([]);

  useEffect(() => {
    let total = 0;
    loot.map((v) => {
      total += v.total;
    });
    onTotalLootChange(total);
  }, [loot, onTotalLootChange]);

  const handleChangeLoot = (rowId: string, value: number) => {
    const tempLoot: LootDataType[] = JSON.parse(JSON.stringify(loot));
    const index = _.findIndex(tempLoot, (v) => v.id === rowId);
    tempLoot[index].total = value;
    setLoot(tempLoot);
  };

  const handleAddLoot = () => {
    const tempLoot: LootDataType[] = JSON.parse(JSON.stringify(loot));
    tempLoot.push({
      id: `LOOT-${Math.random()}`,
      total: 0,
    });
    setLoot(tempLoot);
  };

  const handleRemoveLoot = (rowId: string) => {
    let tempLoot: LootDataType[] = JSON.parse(JSON.stringify(loot));
    tempLoot = tempLoot.filter((v) => v.id !== rowId);
    setLoot(tempLoot);
  };

  return (
    <div>
      <h4>Total Loot : {totalLoot}</h4>
      {loot.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            marginTop: "2em",
            marginBottom: "2em",
          }}
        >
          {loot.map((v) => {
            return (
              <div style={{ display: "flex", gap: "1em" }}>
                <Tooltip
                  title={`${new Intl.NumberFormat("id-ID").format(v.total)}`}
                  trigger="focus"
                >
                  <InputNumber
                    onChange={(value) => handleChangeLoot(v.id, value || 0)}
                    value={v.total}
                    style={{ width: "500px" }}
                  />
                </Tooltip>
                <Button
                  icon={<CloseCircleFilled />}
                  danger
                  onClick={() => handleRemoveLoot(v.id)}
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <Button
        icon={<PlusCircleFilled />}
        style={{ width: "100%" }}
        type="primary"
        onClick={handleAddLoot}
      >
        Add Loot Tab
      </Button>
    </div>
  );
};
export default TotalLoot;
