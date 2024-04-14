import * as http from "../base";
/**
 * 验证cron表达式
 *
 * @param value
 * @returns
 */
export function validateCron(value: string) {
  return http.get<any, string>(`/sys/quartz/job/validateCron`, {
    cronExpression: value
  });
}
/**
 *  定时任务-分页查询
 *
 * @param query
 * @returns
 */
export function pageTaskJob(query?: any) {
  return http.get<any, any>(`/sys/quartz/job`, query);
}
/**
 * 定时任务-新增
 *
 * @param data
 * @returns
 */
export function saveTaskJob(data: any) {
  return http.post<any, any>(`/sys/quartz/job`, data);
}

/**
 * 定时任务-修改
 *
 * @param data
 * @returns
 */
export function updateTaskJob(data: any) {
  return http.put<any, any, string>(`/sys/quartz/job`, {}, data);
}

/**
 * 定时任务-删除
 *
 * @param id
 * @returns
 */
export function DeleteTaskJob(id: number) {
  return http.del<any, any, string>(`/sys/quartz/job`, { id: id });
}

/**
 * 定时任务-立即执行
 *
 * @param id
 * @returns
 */
export function RunTaskJob(id: number) {
  return http.put<any, any, any>(`/sys/quartz/job/run?id=${id}`);
}

/**
 * 定时任务-暂停
 *
 * @param id
 * @returns
 */
export function PauseTaskJob(id: number) {
  return http.put(`/sys/quartz/job/pause`, { id: id });
}

/**
 * 定时任务-恢复
 *
 * @param id
 * @returns
 */
export function ResumeTaskJob(id: number) {
  return http.put(`/sys/quartz/job/resume`, { id: id });
}
