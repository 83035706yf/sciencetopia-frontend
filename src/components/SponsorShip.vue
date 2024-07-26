<template>
        <v-container class="sponsorship-page py-5">
            <v-row class="text-center">
                <v-col>
                    <h1>赞助我们</h1>
                    <h1> ❤️</h1>
                    <p>Sciencetopia是一个对用户永久免费的自主学习平台。如果你从中受益，你可以为我们打赏赞助。你的支持会让Sciencetopia走得更远。</p>
                </v-col>
            </v-row>

            <v-row class="text-center mb-5">
                <v-col>
                    <!-- <v-img src="../assets/images/sponsorship.png" aspect-ratio="16/9" class="sponsorship-image" /> -->
                </v-col>
            </v-row>

            <v-row class="text-center">
                <v-col>
                    <h2>如何支持我们</h2>
                    <p>您可以通过以下方式支持我们：</p>
                </v-col>
            </v-row>

            <v-row class="text-center">
                <v-col cols="12" md="4">
                    <v-card class="sponsorship-card">
                        <v-card-title>微信支付</v-card-title>
                        <v-card-text>
                            <v-img src="../assets/images/wechat_qr.png" aspect-ratio="1" class="qr-code" />
                            <p>打开微信扫一扫，支持我们。</p>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card class="sponsorship-card">
                        <v-card-title>支付宝支付</v-card-title>
                        <v-card-text>
                            <v-img src="../assets/images/alipay_qr.png" aspect-ratio="1" class="qr-code" />
                            <p>打开支付宝扫一扫，支持我们。</p>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card class="sponsorship-card">
                        <v-card-title>PayPal支付</v-card-title>
                        <v-card-text>
                            <v-img src="../assets/images/paypal_qr.png" aspect-ratio="1" class="qr-code" />
                            <p>打开PayPal扫一扫，支持我们。</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="text-center mt-5">
                <v-col>
                    <h2>谢谢你的支持</h2>
                    <p>你的每一次赞助我们都记在心上。我们的每一笔收支都向你公开、透明。</p>
                </v-col>
            </v-row>

            <v-row class="text-center mt-5">
                <v-col>
                    <h2>联系我们</h2>
                    <p>如果您有任何问题或需要进一步的信息，请随时联系我们：</p>
                    <p>Email: support@sciencetopia.org</p>
                    <p>电话: +123 456 7890</p>
                </v-col>
            </v-row>

            <v-row class="text-center mt-5">
                <v-col>
                    <h2>赞助者</h2>
                    <v-list>
                        <v-list-item v-for="sponsor in sponsors" :key="sponsor.id">
                            <v-list-item-content>
                                <v-list-item-title>{{ sponsor.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ sponsor.message }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
</template>

<script>
export default {
    name: 'SponsorShip',
};
</script>

<style scoped>
.sponsorship-page {
    padding-top: 20px;
}

.text-center {
    text-align: center;
}

.mb-5 {
    margin-bottom: 20px;
}

.mt-5 {
    margin-top: 20px;
}

.sponsorship-card {
    margin-bottom: 20px;
}

.qr-code {
    max-width: 150px;
    margin: 0 auto;
    display: block;
}
</style>