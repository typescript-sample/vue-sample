<template>
  <div>
    <vue-final-modal
            v-model="isOpenAppreciationModal"
            content-class="modal-content"
            classes="modal-container"
            :z-index="1000"
        > 
      <form
        id='addNewAppreciation'
        name='addNewAppreciation'
        model-name='addNewAppreciation'
        class="modal__title"

      >
        <header>
          <button
            type='button'
            id='btnClose'
            name='btnClose'
            
           class='btn-close btn-close-app'
            @click="closeModal"
          />
        </header>
        <div>
          <section class='section-appreciate'>
            <input type="text" class="input-appreciate" placeholder='Title' v-model="title" />
            <textarea style="height:140px" class="input-appreciate" placeholder='Description' v-model="description" />
          </section>
        </div>
        <footer class="modal__action">
          <button
            type='submit'
            id='btnSave'
            name='btnSave'
            @click.prevent="postReview"
          >
            Post
          </button>
        </footer>
      </form>

    </vue-final-modal>
    </div>

    
</template>

<script lang="ts">

import {
  getResource,
  handleError,
  initForm,
  registerEvents,
  StringMap,
} from "uione";
import { storage, UserAccount } from 'uione';
import { useAppreciationService, useAppreciationReplyService, User, getMyProfileService } from './user';
import { Appreciation } from "./appreciation";
import { AppreciationReply } from './appreciation-reply';
import { Options, Vue } from "vue-class-component";
import { buildId, EditComponent } from "vuex-one";

@Options({
    props: [
        'dataApp',
        'isOpenAppreciationModal',
        // 'voteStar',
        // 'customStyles'
    ],
    emits: ["onModelClose", 'loadData', 'setData'],
})
export default class PostAppreciationForm extends Vue {

    appreciationService = useAppreciationService();
    appreciationReplyService = useAppreciationReplyService();
    title: string = '';
    description:string = '';
    dataApp: Appreciation | AppreciationReply = {} as any;
    isOpenAppreciationModal: boolean = true;
    dataUser: User = {} as any;
    id:string = '';
    // result: any ;
    appreciationId: string = '';

    created(){
        this.id = this.$route.params.id as string;
        this.appreciationId = this.dataApp?.id ? this.dataApp.id : '';
    }

    postReview = async () => {
    // const userId =this.$route.params.id as string;
    // const userId = buildId<string>(this.$route) as string;
    
    const userId = this.id ;

    // console.log('id::::', userId);
    // console.log('data::::', this.appreciationId);
    const id: string | undefined = storage.getUserId();
    if (!this.appreciationService) { this.closeModal(); return }
    if (!this.appreciationId) {
        
      const appreciation: Appreciation = {
        userId,
        authorId: id || '',
        title: this.title,
        description: this.description,
        usefulCount: 0,
        replyCount: 0,
        createdAt: this.createDate(),
      }
      const data = await this.appreciationService.insert(appreciation);
      const newAppreciation: Appreciation = (data as any)['value']
      this.setData(newAppreciation);
      this.loadData();
      this.closeModal();
        this.title = '';
        this.description = '';
      return
    }
    
    if (!this.appreciationReplyService) { this.closeModal(); return }
    const appreciation: AppreciationReply = {
      userId,
      authorId: id || '',
      title: this.title,
      description: this.description,
      usefulCount: 0,
      replyCount: 0,
      createdAt: this.createDate(),
      appreciationId: this.appreciationId
    }
    const data = await this.appreciationReplyService?.insertReply(appreciation);
    const newAppreciation: AppreciationReply = (data as any)['value']
    this.setData(newAppreciation);
    this.loadData();
    this.closeModal();
    this.title = '';
    this.description = '';
    return
  };

    closeModal(){
        this.$emit("onModelClose");
        // this.review = '';
    }

    loadData(){
        this.$emit("reLoadData");
    }

    setData(newAppreciation: any){
        this.$emit("setData", newAppreciation);
    }

    createDate() {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date +' '+ time;
        return dateTime;
    }
}
</script>
<style scoped>

form>header {
    color: #ffffff;
    background-image: linear-gradient(90deg, #008577, #00574b);
    height:50px
}
.btn-close-app::before {
    margin-left: -16px;
    color: #000000;
}

form>footer>button {
    background-color: #4db6ac;
    color: #ffffff;
        width: 100px;
    max-width: 50%;
    border-radius: 20px;
}
.section-appreciate {
  padding: 20px;
  border-radius: 20px;
  background-color: #ffffff;
}

.input-appreciate {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  outline: none;
  background-color: #f5f5f5;
  /* background-color: #b4b2b2; */
  width: 100%;
  border-radius: 10px;
  height: 30px;
  margin-bottom: 10px;
}

.input-appreciate:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  outline: none;
}

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .modal-content {
  /* display: inline-block; */
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: rgb(250, 250, 250);
  width: 40%;
  max-width: 1000px;
  max-height: 700px;
  height: 40%; 
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}

</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>