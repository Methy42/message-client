<template>
    <div class="login-container">
        <div class="header">
            <h1 class="title">Login</h1>
            <div class="action">
                <el-button @click="closeWindow" text :icon="CloseIcon" circle size="large" />
            </div>
        </div>
        <div class="body">
            <el-form
                label-position="top"
                :model="loginForm"
            >
                <el-form-item label="Set Avatar">
                    <el-avatar :size="50" :src="loginForm.avatarUrl" />
                </el-form-item>
                <el-form-item label="Username">
                    <el-input v-model="loginForm.username" placeholder="Username"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="loginEnter" type="primary" :icon="RightIcon" circle size="large" style="margin-top: 75px; margin-left: auto; margin-right: auto;" />
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {
  Right,
  Close
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

export default {
    data() {
        return {
            loginForm: {
                avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                username: '',
            },
            RightIcon: Right,
            CloseIcon: Close,
        }
    },
    methods: {
        loginEnter() {
            this.$router.push("/home");
        },
        closeWindow() {
            window.close();
        }
    }
}
</script>

<style scoped>
.login-container {
    width: 300px;
    height: 500px;
}

.login-container .header {
    height: 120px;
    padding: 0px 2rem;
    display: flex;
    align-items: center;
    -webkit-app-region: drag;
}

.login-container .header .title {
    flex-grow: 1;
}

.login-container .header .action * {
    -webkit-app-region: no-drag;
}

.login-container .body {
    padding: 0px 2rem;
}
</style>