import { useContext } from "react";
import TaskContext from "../contexts/TaskContext";

export function useTasks() {
  return useContext(TaskContext);
}

export default useTasks;