// components/search/search.js
const app = getApp()
const db = wx.cloud.database()
Component({
  options:{
    styleIsolation:'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus:false,
    historyList:[],
    searchList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(){
      wx.getStorage({
        key: 'searchHistory',
        success:(res)=>{
          this.setData({
            historyList:res.data
          })
        }
      })

      this.setData({
        isFocus:true
      })
    },
    handleCancel(){
      this.setData({
        isFocus:false
      })
    },
    handleConfirm(e){
// console.log(e.detail.value);
      let value = e.detail.value;
      let cloneHistoryList = [...this.data.historyList];
      cloneHistoryList.unshift(value);
      wx.setStorage({
        data: [...new Set(cloneHistoryList)],
        key: 'searchHistory',
      })
      this.changeSearchList(value);
    },
    handleDel(){
      wx.removeStorage({
        key: 'searchHistory',
        success:res =>{
          this.setData({
            historyList:[]
          })
        }
      })
    },
    changeSearchList(value){
      db.collection('users')
      .where({
        nickName:db.RegExp({
          regexp:value,
          options:'i'
        })
      })
      .field({
        userPhoto:true,
        nickName:true
      })
      .get()
      .then(res=>{
        this.setData({
          searchList:res.data
        })
      })
    },
    handleHistoryItemDel(e){
      let value = e.target.dataset.text;
      this.changeSearchList(value);
      
    }
  }
})
