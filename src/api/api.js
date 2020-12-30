// 权限管理API  【菜单、角色、权限】
import request from '@/api/request'

/**
 * 添加菜单
 * @param {*} data
 * @author 小道仙
 * @date 2020年2月19日
 */

// 登录
export function login(code) {
    return request({
        url: '/user/login?code=' + code,
        method: 'get',
    })
}

export function baselogin(code) {
    return request({
        url: '/user/base_login?code=' + code,
        method: 'get',
    })
}

export function getOther(data) {
    return request({
        url: '/user/get_other?session=' + data.session,
        method: 'post',
        data:{
            uid:data.uid
        }
    })
}




// 非静默授权获取用户信息
export function updateDetail(data) {
    return request({
        url: '/user/update_detail?code=' + data.code,
        method: 'get',

    })
}

// 获取用户信息
export function getUser(session) {
    return request({
        url: '/user/get?session=' + session,
        method: 'POST',

    })
}


// 收到的信息列表
export function queryReceive(data) {
    return request({
        url: '/social/query_receive?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// 发送的信息列表
export function querySend(data) {
    return request({
        url: '/social/query_send?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}



export function readLetter(data) {
    return request({
        url: '/social/read_letter?session=' + data.session,
        method: 'post',
        data: {
            lid: data.lid
        }
    })
}

// 获取信的详情
export function getLetter(data) {
    return request({
        url: '/social/get?session=' + data.session,
        method: 'post',
        data: {
            lid: data.lid,
            is_receive: data.is_receive
        }
    })
}

// 回复信息
export function replyletter(data) {
    return request({
        url: '/social/reply?session=' + data.session,
        method: 'post',
        data: {
            lid: data.lid,
            content: data.content,
            from_uid:data.from_uid
        }
    })
}


// 删除列表/回收站
export function queryDelete(data) {
    return request({
        url: '/social/query_delete?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

//屏蔽列表
export function queryBlacklist(data) {
    return request({
        url: '/social/query_blacklist?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

//屏蔽用户
export function blockUser(data) {
    return request({
        url: '/social/block_user?session=' + data.session,
        method: 'post',
        data: {
            lid: data.lid,
            block_uid: data.block_uid
        }
    })
}

//解除屏蔽用户
export function blockUid(data) {
    return request({
        url: '/social/deblock_user?session=' + data.session,
        method: 'post',
        data: {
            block_uid: data.id
        }
    })
}

//上传图片
export function uploadImg(data) {
    return request({
        url: '/social/upload_img?session=' + data.session,
        method: 'post',
        data: data.formdata
    })
}

//查询访问记录列表
export function queryVisitor(data) {
    return request({
        url: '/social/query_visitor?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

//提交支付反馈
export function createFeedback(data) {
    return request({
        url: '/wxpay/create_feedback?session=' + data.session,
        method: 'post',
        data: {
            img: data.img
        }
    })
}

//获取jssdk配置
export function getConfig(data) {
    return request({
        url: '/user/get_config?session=' + data.session,
        method: 'post',
        data: {
            wechaturl: data.wechaturl
        }
    })
}

//生成支付订单
export function createPay(data) {
    return request({
        url: '/wxpay/create_pay?session=' + data.session,
        method: 'post',
        data: {
            body: data.body,
            total_fee: data.total_fee
        }
    })
}

// 更新用户查询访客记录的权限(在付费后使用)
export function updateUnlockStatus(data) {
    return request({
        url: '/user/update_unlock_status?session=' + data.session,
        method: 'post',
        data: {
            trade_no: data.data,
            flag: data.flag
        }
    })
}

//删除来信
export function deleteLetter(data){
    return request({
        url:'/social/delete?session=' + data.session,
        method:'post',
        data:{
            lid: data.lid
        }
    })
}

//发匿名信
export function sendLetter(data){
    return request({
        url:'/social/send?session=' + data.session,
        method:'post',
        data:{
            uid: data.uid,
            content:data.content
        }
    })
}

//获取反馈
export function queryFeedback(session){
    return request({
        url:'/wxpay/query_feedback?session=' + session,
        method:'post',
    })
}

//处理反馈结果
export function handleFeedback(data){
    return request({
        url:'/wxpay/handle_feedback?session=' + data.session,
        method:'post',
        data:{
            uid:data.uid,
            fid:data.fid,
            flag:data.flag
        }
    })
}

// ## 管理员获取反馈结果详情
export function getFeedback(data){
    return request({
        url:'/wxpay/get_feedback?session=' + data.session,
        method:'post',
        data:{
            fid:data.fid,
        }
    })
}


// ## 判断是否被拉黑
export function judgeBlock(data){
    return request({
        url:'/social/judge_block?session=' + data.session,
        method:'post',
        data:{
            uid:data.uid,
        }
    })
}

// 恢复删除的信息
export function recoverLetter(data){
    return request({
        url:'/social/recover_letter?session=' + data.session,
        method:'post',
        data:{
            lid:data.lid,
        }
    })
}

// ## 判断是否为管理员
export function judgeAdmin(session) {
    return request({
        url: '/user/judge_admin?session=' + session,
        method: 'post',
    })
}

// ## 访客登记
export function registerVisitor(data) {
    return request({
        url: '/social/register_visitor?session=' + data.session,
        method: 'post',
        data:{
            visitor_uid:data.visitor_uid
        }
    })
}
