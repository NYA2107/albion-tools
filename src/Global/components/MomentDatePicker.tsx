import { Moment } from "moment";
import momentConfig from "rc-picker/lib/generate/moment";
import generatePicker from "antd/es/date-picker/generatePicker";

const MomentDatePicker = generatePicker<Moment>(momentConfig);

export default MomentDatePicker;
