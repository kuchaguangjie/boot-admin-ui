import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { enabledOptions, usePublicHooks } from "@/utils/constants";
import type { PaginationProps } from "@pureadmin/table";
import { h, onMounted, reactive, ref } from "vue";
import { treeOrg } from "@/api/basic/org";
import { listRole } from "@/api/basic/role";
import * as userApi from "@/api/basic/user";
import type { FormItemProps } from "./types";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";
import { deviceDetection, isAllEmpty, isFunction } from "@pureadmin/utils";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { zxcvbn } from "@zxcvbn-ts/core";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { ElForm, ElFormItem, ElInput, ElProgress } from "element-plus";
import { watch } from "vue";

export function useUser() {
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();
  const restPwdFormRef = ref();

  // 当前密码强度（0-4）
  const curScore = ref();
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];

  const currentOrg = ref(null);
  const roleData = ref();
  const permission = reactive({
    query: ["bas:user:query"],
    add: ["bas:user:save"],
    edit: ["bas:user:update"],
    delete: ["bas:user:delete"],
    resetPwd: ["bas:user:restPassword"]
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const treeOrgData = reactive<{
    loading: boolean;
    dataList: Array<any>;
  }>({
    loading: false,
    dataList: []
  });
  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: Array<any>;
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "账号",
        options: {
          prop: "username",
          placeholder: "请输入账号查询"
        }
      },
      {
        type: "input",
        label: "姓名",
        options: {
          prop: "nickname",
          placeholder: "请输入姓名查询"
        }
      },
      {
        type: "input",
        label: "联系人电话",
        options: {
          prop: "linkTel",
          placeholder: "请输入联系人电话查询"
        }
      },
      {
        type: "select",
        label: "状态",
        options: {
          prop: "enabled",
          placeholder: "请选择状态",
          dataSourceKey: "enabledOptions"
        }
      }
    ],
    dataSource: {
      enabledOptions: enabledOptions
    }
  });
  const tableData = reactive<{
    loading: boolean;
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "用户名称",
        prop: "username",
        minWidth: 130
      },
      {
        label: "用户昵称",
        prop: "nickname",
        minWidth: 130
      },
      {
        label: "性别",
        prop: "gender",
        minWidth: 90,
        cellRenderer: ({ row, props }) => (
          <el-tag
            size={props.size}
            type={row.gender === 1 ? "danger" : null}
            effect="plain"
          >
            {row.gender === 1 ? "女" : "男"}
          </el-tag>
        )
      },
      {
        label: "联系电话",
        prop: "phone",
        minWidth: 130
      },
      {
        label: "所属机构",
        prop: "org.name",
        minWidth: 130
      },
      {
        label: "状态",
        prop: "enabled",
        minWidth: 90,
        cellRenderer: scope => (
          <el-switch
            size={scope.props.size === "small" ? "small" : "default"}
            loading={switchLoadMap.value[scope.index]?.loading}
            v-model={scope.row.enabled}
            active-value={true}
            inactive-value={false}
            active-text="已启用"
            inactive-text="已停用"
            inline-prompt
            style={switchStyle.value}
            onChange={() => onChange(scope as any)}
            disabled={scope.row.system}
          />
        )
      },
      {
        label: "创建时间",
        minWidth: 90,
        prop: "created"
      },
      {
        label: "最后登陆时间",
        minWidth: 90,
        prop: "lastLoginTime"
      },
      {
        label: "操作",
        fixed: "right",
        width: 180,
        slot: "operation"
      }
    ]
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function openDrawer(title = "新增", data?: FormItemProps) {
    addDrawer({
      title: `${title}用户`,
      width: "35%",
      props: {
        formInline: {
          id: data?.id ?? undefined,
          org: data?.org ?? undefined,
          orgId: data?.org?.id ?? currentOrg?.value ?? "",
          roles: data?.roles ?? [],
          roleIds: data?.roles?.map((item: any) => item.id) ?? [],
          username: data?.username ?? "",
          nickname: data?.nickname ?? "",
          password: "",
          confirmPassword: "",
          phone: data?.phone ?? "",
          email: data?.email ?? "",
          avatar: data?.avatar ?? "",
          gender: data?.gender ?? 1,
          system: data?.system ?? false,
          enabled: data?.enabled ?? true
        },
        roleList: roleData.value,
        orgList: treeOrgData.dataList
      },
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      footerButtons: [
        {
          label: "取消",
          bg: true,
          btnClick: ({ drawer: { options, index } }) => {
            const done = () =>
              closeDrawer(options, index, { command: "cancel" });
            if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
              options.beforeCancel(done, { options, index });
            } else {
              done();
            }
          }
        },
        {
          label: "确认",
          type: "primary",
          bg: true,
          confirm: true,
          tips: `是否${title}用户`,
          btnClick: ({ drawer: { options, index } }) => {
            const done = () => closeDrawer(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        console.log(curData);
        function chores() {
          message("保存成功");
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            const data = convertData(curData);
            if (curData.id) {
              await userApi.updateUser(data).then(() => {
                chores();
              });
            } else {
              await userApi.saveUser(data).then(() => {
                chores();
              });
            }
          }
        });
      }
    });
  }
  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );
  function handleRestPwd(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      footerButtons: [
        {
          label: "取消",
          bg: true,
          btnClick: ({ dialog: { options, index } }) => {
            const done = () =>
              closeDialog(options, index, { command: "cancel" });
            if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
              options.beforeCancel(done, { options, index });
            } else {
              done();
            }
          }
        },
        {
          label: "确认",
          type: "primary",
          bg: true,
          popconfirm: true,
          tips: `重置 ${row.username} 用户的密码`,
          btnClick: ({ dialog: { options, index } }) => {
            const done = () => closeDialog(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () => (
        <>
          <ElForm ref={restPwdFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        restPwdFormRef.value.validate(async valid => {
          if (valid) {
            const { success } = await userApi.resetPassword({
              id: row.id,
              password: pwdForm.newPwd
            });
            if (success) {
              // 表单规则校验通过
              message(`已成功重置 ${row.username} 用户的密码`, {
                type: "success"
              });
              // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }
          }
        });
      }
    });
  }

  function convertData(formData) {
    console.log(formData);
    return {
      id: formData.id,
      username: formData.username,
      nickname: formData.nickname,
      password: formData.password ?? "",
      phone: formData.phone,
      email: formData.email,
      avatar: formData.avatar,
      orgId: formData.orgId,
      roleIds: formData.roleIds,
      gender: formData.gender,
      system: false,
      enabled: formData.enabled
    };
  }
  /*======tree========*/
  function handleCurrentOrg({ id, selected }) {
    currentOrg.value = id;
    searchData.data.orgId = selected ? id : "";
    pagination.currentPage = 1;
    onSearch();
  }

  // function onChange({ row, index }) {
  // }
  function onChange() {}

  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize,
      sorts: "created desc"
    };
    const { success, data } = await userApi.pageUser(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }
  async function loadDeptTree() {
    treeOrgData.loading = true;
    const { success, data } = await treeOrg({ sorts: "created" }).finally(
      () => {
        treeOrgData.loading = false;
      }
    );
    if (success) {
      treeOrgData.dataList = data;
    }
  }
  async function loadRoles() {
    const { success, data } = await listRole({ sorts: "created desc" });
    if (success) {
      roleData.value = data;
    }
  }

  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  function handleChangeCurrentPage(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handleChangePageSize(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  onMounted(() => {
    loadDeptTree();
    loadRoles();
    onSearch();
  });

  return {
    permission,
    treeOrgData,
    searchData,
    tableData,
    pagination,
    loadDeptTree,
    handleCurrentOrg,
    onSearch,
    openDrawer,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    handleRestPwd
  };
}
