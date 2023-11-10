import { Badge, Button, Card, Space, Typography } from "antd";
import lootSplitWallpaper from "../Global/assets/loot-split-wallpaper.jpg";
import partyTrackerWallpaper from "../Global/assets/party-tracker-wallpaper.jpg";
import logoTisu from "../Global/assets/Tisu Paseo.png";
import craftingWallpaper from "../Global/assets/crafting-wallpaper.jpeg";
import { useNavigate } from "react-router-dom";
import { SmileOutlined } from "@ant-design/icons";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Space
        direction="vertical"
        size={30}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "200px",
            overflow: "hidden",
            position: "relative",
            width: "600px",
          }}
        >
          <img
            style={{ width: "100%", position: "absolute", bottom: "-252px" }}
            src={logoTisu}
          ></img>
        </div>
        <Button
          type="link"
          href="https://saweria.co/TisuuPaseoo"
          target="_blank"
        >
          https://saweria.co/TisuuPaseoo
        </Button>
        <Space>
          <Card
            hoverable
            onClick={() => navigate("/party-time-tracker")}
            style={{ width: 240 }}
            cover={
              <div
                style={{
                  height: "300px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  alt="example"
                  style={{ height: "100%", position: "absolute", left: -150 }}
                  src={partyTrackerWallpaper}
                />
              </div>
            }
          >
            <Card.Meta
              title="Party Time Tracker"
              description="A tool to monitor how long members play, rest and leave the group in a content"
            />
          </Card>
          <Card
            onClick={() => navigate("/loot-split-tool")}
            hoverable
            style={{ width: 240 }}
            cover={
              <div
                style={{
                  height: "300px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  alt="example"
                  style={{ height: "100%", position: "absolute", left: -60 }}
                  src={lootSplitWallpaper}
                />
              </div>
            }
          >
            <Card.Meta
              title="Loot Split Tool"
              description="A tool for distribute party loot based on total time played of the party members"
            />
          </Card>
          <Badge.Ribbon text="Coming Soon" color="lime">
            <div style={{ position: "relative", overflow: "hidden" }}>
              <Card
                style={{ width: 240 }}
                cover={
                  <div
                    style={{
                      height: "300px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      alt="example"
                      style={{
                        height: "100%",
                        position: "absolute",
                        left: -130,
                      }}
                      src={craftingWallpaper}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title="Crafting Tool"
                  description="Tool for calculate needs, capital money and profits for items to be refined or crafted"
                />
              </Card>

              <Space
                direction="vertical"
                style={{
                  width: "240px",
                  height: "440px",
                  background: "rgba(27, 27, 27, 0.3)",
                  position: "absolute",
                  top: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <SmileOutlined
                  style={{
                    zIndex: 100,
                    fontSize: "60px",
                    color: "rgba(220, 220, 220, 1)",
                  }}
                />
                <Typography.Text
                  style={{ zIndex: 100, color: "rgba(220, 220, 220, 1)" }}
                >
                  Under Construction
                </Typography.Text>
              </Space>
            </div>
          </Badge.Ribbon>
        </Space>
      </Space>
    </div>
  );
};

export default Home;
