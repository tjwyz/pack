<template>
    <div class="c-atom-aftclk"
         v-show="show"
         @click="function(){tjwyz = 111}" >
        <img
            class="c-atom-aftclk-title"
            :text="title"
            icon="baidu"/>
        <div class="c-scroll-wrapper">
            <div class="c-scroll-touch">
                <div class="c-gap-bottom-small">
                    <template v-for="(rsitem, index) in upList">
                        <tjwyz 
                            :url="rsitem.href"
                            class="c-scroll-item"
                            :text="rsitem.text"
                            type="auto"></tjwyz>
                    </template>
                </div>
            </div>
        </div>
        <div class="c-atom-aftclk-cover"></div>
    </div>
</template>






<script type="config">
    {
        props: {
            upList: {
                type: Array
            },
            downList: {
                type: Array
            },
            title: {
                type: String,
                default: '大家还搜'
            },
            order: {
                type: Number,
                required: true
            }
        },
        components: {
            tjwyz:require('weather/tjwyz'),
            haha:require('weather/haha'),
        },
        data: function(){
            return{
                show: 0
            }
        }
    }



</script>



<script>
    exports.default = {
        mounted: function () {
            this._init();
        },
        methods: {
            _init: function() {
                console.log("ls");
            },
            toggle: function (bool) {
                if (bool) {
                    this.show = this.upList && this.upList.length;
                }else {
                    this.show = 0;
                }
            },
            replace: function(data) {
                this.upList = data.upList;
                this.downList = data.downList;
            }
        }
    };
</script>

<style scoped>
    .c-atom-aftclk{
        background-color: #f1f1f1;
        position: relative;
        overflow: hidden;
    }
    .c-atom-aftclk-title{
        padding-top: 2px;
        color: #999;
        font-size: 14px;
        margin-left: .17rem;
    }
    .c-scroll-wrapper{
        height: auto;
        padding-top: 0;
        background-color: #f1f1f1;
        padding-bottom: .1rem;
        text-align: left;
        color: #666;
        white-space: nowrap;
    }
    .c-scroll-touch{
        position: relative;
        overflow-x: auto;
        padding-left: .17rem;
        -webkit-overflow-scrolling: touch;
        margin-top: -.3rem;
        padding-bottom: .3rem;
        padding-right: 0;
        -webkit-transform: translateY(.3rem);
        transform: translateY(.3rem);
    }
    .c-scroll-item{
        margin-right: .1rem;
        background-color: #fff;
    }
    .c-scroll-item:active{
        background-color: #e5e5e5;
    }
    .c-scroll-item:last-child{
        border-right: .17rem solid #f1f1f1;
    }
    .c-atom-aftclk-cover{
        position: absolute;
        top: 0;
        right: 0;
        width: 29px;
        height: 2rem;
        background-image: linear-gradient(to right,rgba(241,241,241,0),#f1f1f1);
    }
</style>
<style>
    .c-atom-aftclk-title .c-title {
        font-size: 14px;
        min-height: 14px;
        line-height: 14px;
        margin-top: .02rem;
        margin-bottom: .08rem;
    }
    .c-atom-aftclk-title .c-title .c-icon {
        font-size: 14px;
        margin-left: .02rem;
    }
    .wa-cl_recommend-container .c-atom-aftclk {
        padding-top: .1rem;
        margin-bottom: -.1rem;
    }
</style>

