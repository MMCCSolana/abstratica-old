import axios from "axios";

export default async function getCollectorData() {
  const { data } = await axios.get(process.env.VUE_APP_COLLECTOR_DATA_API);
  return data;
}
