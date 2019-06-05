<template>
    <div class="card text-white bg-dark">
        <p class="card-text">
            <div class="row">
                <div class="col display-3 text-center">{{stock.s_name}}</div>
                <div class="col display-3 text-center">
                    ${{stock.s_price}} 
                    <span :class="{'text-danger': (price_change < 0), 'text-success':(price_change>0)}">({{price_change_text}})</span>
                </div>
            </div>
        <!-- TODO add difference and maybe graph -->
        </p>
    </div>
</template>
<script>
export default {
    name: 'Share',
    props: {
        stock: {
            type: Object,
            required: true,
            validator(x) {
                if (x.s_name == undefined) return "danger";
                return "warning";
            }
        }
    },
    data() {
        return {}
    },
    computed: {
        price_change: function(){
            if (this.stock.s_history.length == 0) return 0;
            var last_price = this.stock.s_history[this.stock.s_history.length-1];
            return this.stock.s_price - last_price;
        },
        price_change_text: function(){
            var difference = this.price_change;
            if (difference > 0) return "+"+difference;
            return difference;
        }
    }
}
</script>