import { requst } from "./request";

// 登录请求
export const reqLogin = (data) =>
  requst({
    url: "login",
    method: "post",
    data,
  });

// 侧边菜单请求
export const reqMenuList = () =>
  requst({
    url: "menus",
  });

// 用户列表请求
export const reqUserList = (params) =>
  requst({
    url: "users",
    params,
  });

// 修改用户状态
export const reqUpdateState = (uid, type) =>
  requst({
    url: `users/${uid}/state/${type}`,
    method: "put",
  });

// 添加用户
export const reqAddUsers = (data) =>
  requst({
    url: "users",
    method: "post",
    data,
  });

// 编辑用户
export const reqUpdateUsers = (id, data) =>
  requst({
    url: `users/${id}`,
    method: "put",
    data,
  });

// 删除用户
export const reqDeleteUser = (id) =>
  requst({
    url: `users/${id}`,
    method: "delete",
  });

// 获取角色列表
export const reqRolesList = () =>
  requst({
    url: `roles`,
  });

// 分配用户角色
export const UpdateUserRole = (id, rid) =>
  requst({
    url: `users/${id}/role`,
    method: "put",
    data: { rid },
  });

// 删除角色指定权限
export const reqDeleteRoles = (roleId, rightId) =>
  requst({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete",
  });

// 添加角色
export const reqAddRoles = (data) =>
  requst({
    url: "roles",
    method: "post",
    data,
  });

// 编辑提交角色
export const reqUpdateRoles = (id, data) =>
  requst({
    url: `roles/${id}`,
    method: "put",
    data,
  });

// 删除角色
export const reqDeleteRole = (id) =>
  requst({
    url: `roles/${id}`,
    method: "delete",
  });

// 所有权限列表
export const reqRightsList = (type) =>
  requst({
    url: `rights/${type}`,
  });

// 角色授权
export const reqUpdataRoleRights = (roleId, rids) =>
  requst({
    url: `roles/${roleId}/rights`,
    method: "post",
    data: { rids },
  });

// 数据统计
export const reqReports = () =>
  requst({
    url: "reports/type/1",
  });

// 商品分类列表
export const reqCategories = (params) =>
  requst({
    url: "categories",
    params,
  });

// 商品列表
export const reqGoodsList = (params) =>
  requst({
    url: "goods",
    params,
  });

// 编辑提交商品
export const reqUpdataGoods = (id, data) =>
  requst({
    url: `goods/${id}`,
    method: "put",
    data,
  });

// 添加商品
export const reqAddGoods = (data) => requst({
  url: "goods",
  method: "post",
  data
})

// 删除商品
export const deleteGoods = (id) =>
  requst({
    url: `goods/${id}`,
    method: "delete",
  });

// 分类参数列表
export const reqCategoriesAttrList = (id, sel) =>
  requst({
    url: `categories/${id}/attributes`,
    params: { sel },
  });

// 订单数据列表
export const reqOrdersList = (params) =>
  requst({
    url: "orders",
    params,
  });

// 删除参数
export const reqDeleteCategor = (id, attrid) => requst({
  url: `categories/${id}/attributes/${attrid}`,
  method: "delete",
})

// 添加参数
export const reqAddCategor = (id, data) => requst({
  url: `categories/${id}/attributes`,
  method: "post",
  data
})

// 编辑提交参数
export const reqUpdataCategor = (id, attrid, data) => requst({
  url: `categories/${id}/attributes/${attrid}`,
  method: "put",
  data
})