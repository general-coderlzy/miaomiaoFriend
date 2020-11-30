// miniprogram/pages/index/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00528-2613.jpg'],
    listData:[],
    current:'links'
  },
  handleCurrent(e){
    
    let current = e.target.dataset.current;
    if (current ==this.data.current) {
      return false;
    }
    this.setData({
      current
    },()=>{
      this.getlistData()
    })
    
  },
  getlistData(){
    db.collection("users")
    .field({
      userPhoto:true,
      nickName:true,
      links:true
    })
    .orderBy(this.data.current,'desc')
    .get()
    .then(res =>{
      // console.log(res.data);
      this.setData({
        listData:res.data
      })
      
    })
  },
  handleDetail(e){
    let id = e.target.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../detail/detail?userId='+id,
    })
  },
  getBannerList(){
    db.collection('banner')
    .get()
    .then(res =>{
      this.setData({
        background:res.data
      })
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
    this.getlistData()
    this.getBannerList()
  },
  handleLinks(e){
    let id = e.target.dataset.id;
    wx.cloud.callFunction({
      name:'update',
      data:{
        collection:"users",
        doc:id,
        data:"{links:_.inc(1)}"
      }
    }).then(res=>{
      // console.log(res);
      
      let updated = res.result.stats.updated;
      if (updated) {
        let clonelistData = [...this.data.listData];
        for (let i = 0; i < clonelistData.length; i++) {
         if(clonelistData[i]._id == id){
          clonelistData[i].links++
         }
          
        }
        this.setData({
          listData:clonelistData
        })
      }
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