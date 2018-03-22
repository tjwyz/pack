<template>
    <div class="c-atom-aftclk-cover"></div>
</template>

<script type="config">
    {
        data: function(){
            return {
                functionshow: 0
            }
        }
    }
</script>

<script>
    exports.default = {
        mounted: function () {
        },









        methods: {
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







