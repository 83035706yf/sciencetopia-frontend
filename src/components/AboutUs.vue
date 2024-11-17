<template>
    <v-container class="about-page py-5">
        <h1>关于我们</h1>
        <v-spacer class="my-5"></v-spacer>
        <p>Sciencetopia是一个由<button class="team-button" @click="toBottom">独立团队</button>搭建的，系统、完备、面向群众、永久免费的科学平台。</p>
        <v-divider class="my-5"></v-divider>
        <p>在当下，汲取信息、学习知识从未如此容易过。搜索引擎、公众号、知乎、B站……更不必说琳琅满目的知识付费类APP，以及蓬勃发展中的AI。正如互联网时代信息爆炸的早期见证者和影响者——米切尔·卡普尔所说：“从互联网获取信息就像从水龙头喝水一样容易。”
        </p>
        <p>但是，学习本身的目的：“每个人的自由而全面的发展”，真的因此而普遍地被实现了吗？</p>
        <p>我们通过调查发现，并没有。</p>
        <p>在一份获得1100多份有效答卷的、针对普通工薪阶级的调查中，尽管绝大部分（8成以上）受访者展示出学习的需求，但由于缺乏时间和精力（占比约34.5%）、经济压力（占比约22.8%）、学习资源难以检索到（占比约13.1%）和缺乏头绪、目标和学习方向（占比约10.3%）等，人们普遍在学习新知识、技能的道路上受阻重重。除此之外，缺乏同伴一起学习、交流、互助（占比约7.1%）和缺乏学习动力与热情（占比约6.7%）也是阻碍受访者学习的重要因素。
        </p>
        <p>可以看到，正如当下商品生产的过剩却无法满足人们对美好生活的需要这一对“奇怪”的资本主义矛盾一样，知识和信息的铺天盖地生产之所以无法满足人们的学习需要、实现每个人自主的全面发展，其原因决不在于知识生产的“不够”，而是指向系统性的症结：
        </p>
        <p>1. 正如人们因缺钱而无法支付商品一样，人们因缺乏学习的“通用货币”——时间而无法学习。</p>
        <p>2.
            正如商品的设计是出于扩张市场、提高用户粘性等以最大化产业利润，而非最大化使用者的福祉一样，知识类应用在设计上并不专注于最大化用户所得。在市场的驱动下，免费的知识类平台（如知乎、b站知识区等）并不关注内容的结构化和系统化，而是零散和碎片化，且常常被非知识或博眼球、猎奇类知识内容充斥。而付费类的知识应用（如coursera、得到等）则在用户获取系统化知识的路上设置了额外的价格门槛。
        </p>
        <p>3. 一个学习环境、学习场所和社区的缺乏。</p>
        <v-divider class="my-5"></v-divider>
        <p>这是一个社会性的、系统性的问题。Sciencetopia作为一个网络平台，不够铲除这个顽疾。</p>
        <p>但是，我们希望并且有信心实现如下目标：</p>
        <v-spacer class="my-5"></v-spacer>
        <p>1. 用全面的、系统化的、永久免费的知识，推平大众学习的门槛，把从基础到前沿的科学知识带给所有人。</p>
        <p>2. 用最为学习者量身打造的方式设计功能，发掘人的学习动力，让大众高效地学习到自己所需的知识。</p>
        <p>3. 建立一个学习者找到志同道合的伙伴、共同进步的平台。</p>
        <p>4. 用最为开放的方式，让每个人都能参与到知识的生产和传播中。</p>
        <v-spacer class="my-5"></v-spacer>
        <p>在未来，我们还希望能将产、学、研结合，让每个人都能参与到探索、研究新问题和生产创新的过程中。</p>
        <v-divider class="my-5"></v-divider>
        <p>我们希望Sciencetopia能成为一个真正属于每个人的科学平台，让每个人都能在这里找到自己的学习伙伴、学习资源、学习动力，实现自己的全面发展。</p>
        <p>毕竟——这就是Sciencetopia的词缀“topia”的涵义：一个环境、一个场景、一个地方。它不是虚无缥缈的乌有之邦，而就在此处。</p>
        <v-divider class="my-5"></v-divider>
        <p>我们希望能在此处搭建这个平台，探索一种可推广的大众学习和创新模式，照亮未来。</p>
        <v-spacer class="my-5"></v-spacer>
        <p>如果你有兴趣，请 <button class="join-us-botton" @click="joinUs">加入我们</button>，一起创造这个属于每个人的Sciencetopia。</p>
        <v-spacer class="my-10"></v-spacer>
        <v-row justify="left">
            <v-col cols="12" md="8">
                <v-simple-table>
                    <thead>
                        <tr>
                            <th colspan="3" class="text-center" style="border: 1px solid black;">开发者名单</th>
                        </tr>
                        <tr>
                            <th class="text-left" style="border: 1px solid black;">名字</th>
                            <th class="text-left" style="border: 1px solid black;">角色</th>
                            <th class="text-left" style="border: 1px solid black;">贡献</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid black;">@大法师猫定谔</td>
                            <td style="border: 1px solid black;">全栈开发</td>
                            <td style="border: 1px solid black;">负责网站的前后端开发和实现</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black;">@狐灵</td>
                            <td style="border: 1px solid black;">数据库开发</td>
                            <td style="border: 1px solid black;">参与知识网络数据库搭建</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black;">@木之子</td>
                            <td style="border: 1px solid black;">美术设计</td>
                            <td style="border: 1px solid black;">参与了网站的美术设计和插图制作</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black;">@</td>
                            <td style="border: 1px solid black;">UI/UX设计</td>
                            <td style="border: 1px solid black;">负责用户界面和网页美术设计</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'AboutUs',
    methods: {
        toBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        },
        joinUs() {
            this.$router.push('/contact');
        }
    }
}
</script>

<style scoped>
/* Add your custom styles here */
.team-button {
    color: #1976D2;
    font-weight: bold;
    cursor: pointer;
}
.team-button:hover {
    text-decoration: underline;
}
.join-us-botton {
    /* background-color: #D5282A; */
    color: #D5282A;
    font-weight: bold;
    cursor: pointer;
    padding: 5px 10px;
    border: 2px solid #D5282A;
    border-radius: 5px;
}
.join-us-botton:hover {
    background-color: #ff0000;
    color: white;
    border: 2px solid #ff0000;
}
</style>