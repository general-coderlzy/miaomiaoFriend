// miniprogram/pages/editUserInfo/weixin/weixin.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxNumber:""
  },
  handleText(e){
    let value = e.detail.value;
    this.setData({
      wxNumber:value
    })
  },
  handleBtn(){
    this.updatewxNumber();
  },
  updatewxNumber(){
    wx.showLoading({
      title: '更新中。。。',
    })
    db.collection("users").doc(app.userInfo._id).update({
      data:{
        wxNumber:this.data.wxNumber
      }
    }).then(res =>{
      wx.hideLoading();
      wx.showToast({
        title: '更新完成',
      })
     
      app.userInfo.wxNumber = this.data.wxNumber;
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      wxNumber:app.userInfo.wxNumber
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})