<template>
  <div class='profile view-container'>
      <form id='userForm' name='userForm' ref="form">
        <header class='border-bottom-highlight'>
          <div class='cover-image'>
            <img src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' alt='cover' />
            <div class='contact-group'>
              <button id='btnPhone' name='btnPhone' class='btn-phone' />
              <button id='btnEmail' name='btnEmail' class='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow' class='btn-follow'>Follow</button>
          </div>
          <button id='btnCamera' name='btnCamera' class='btn-camera' />
          <div class='avatar-wrapper'>
            <img class='avatar'
              :src="user.imageURL || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'" alt='avatar' />
            <img class='profile-status' :src="imageOnline" alt='status' />
          </div>
          <div class='profile-title'>
            <h3>{{user.username}}</h3>
            <p>{{user.website}}</p>
          </div>
          <div class='profile-followers'>
            <p><i class='material-icons highlight'>group</i> {{followers}}</p>
            <p><i class='material-icons highlight'>group_add</i> {{following}}</p>
          </div>
        </header>
        <div class='row'>
          <div class='col m12 l4'>
            <div class='card' v-if="user.occupation || user.company">
              <header>
                <i class='material-icons highlight'>account_box</i>
                {{resource.user_profile_basic_info}}
              </header>
              <p v-if="user.occupation">{{user.occupation}}</p>
              <p v-if="user.company">{{user.company}}</p>
            </div>

            
            <div class='card' v-if="user.skills && user.skills.length > 0">
              <header>
                <i class='material-icons highlight'>local_mall</i>
                {{resource.skills}}
              </header>
              <section>
                  <p  v-for="(item,index) in user.skills" :key="index">{{item.skill}}<i :hidden="!item.hirable" class='star highlight' /></p>
                <hr />
                <p class='description'>
                  <i class='star highlight' />
                  {{resource.user_profile_hireable_skill}}
                </p>
              </section>
            </div>
            <div class='card' v-if="user.lookingFor && user.lookingFor.length > 0">
              <header>
                <i class='material-icons highlight'>find_in_page</i>
                {{resource.user_profile_looking_for}}
              </header>
              <section>
               
                 
                    <p v-for="(item,index) in user.lookingFor" :key="index">{{item}}</p>
                  
                
              </section>
            </div>
            
           
              <div class='card' v-if="user.facebookLink || user.skypeLink || user.twitterLink || user.instagramLink
              || user.linkedinLink || user.googleLink || user.dribbbleLink || user.customLink01
              || user.customLink02 || user.customLink03 || user.customLink04 || user.customLink05
              || user.customLink06 || user.customLink07 || user.customLink08">
                <header>
                  <i class='material-icons highlight'>chat</i>
                  {{resource.user_profile_social}}
                </header>
                <div>
                    <a :href="'https://facebookcom/' + user.facebookLink" title='facebook' target='_blank' rel='noreferrer' v-if="user.facebookLink">
                      <i class='fa fa-facebook' />
                      <span>facebook</span>
                    </a>
                    <a :href="'https://skype.com/' + user.skypeLink" title='Skype' target='_blank' rel='noreferrer' v-if="user.skypeLink">
                      <i class='fa fa-skype' />
                      <span>Skype</span>
                    </a>                  
                    <a :href="'https://twitter.com/' + user.twitterLink" title='Twitter' target='_blank' rel='noreferrer' v-if="user.twitterLink">
                      <i class='fa fa-twitter' />
                      <span>Twitter</span>
                    </a>
                    <a :href="'https://instagram.com/' + user.instagramLink" title='Instagram' target='_blank' rel='noreferrer' v-if="user.instagramLink">
                      <i class='fa fa-instagram' />
                      <span>Instagram</span>
                    </a>           
                    <a :href="'https://linkedin.com/' + user.linkedinLink" title='Linked in' target='_blank' rel='noreferrer'  v-if="user.linkedinLink">
                      <i class='fa fa-linkedin' />
                      <span>Linked in</span>
                    </a>
                    <a :href="'https://plus.google.com/' + user.googleLink" title='Google' target='_blank' rel='noreferrer' v-if="user.googleLink">
                      <i class='fa fa-google' />
                      <span>Google</span>
                    </a>     
                    <a :href="'https://dribbble.com/' + user.dribbbleLink" title='dribbble' target='_blank' rel='noreferrer' v-if="user.dribbbleLink">
                      <i class='fa fa-dribbble' />
                      <span>dribbble</span>
                    </a>
                
                  
                    <a :href="user.customLink01" target='_blank' rel='noreferrer' v-if="user.customLink01">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink02" target='_blank' rel='noreferrer' v-if="user.customLink02">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink03" target='_blank' rel='noreferrer' v-if="user.customLink03">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink04" target='_blank' rel='noreferrer' v-if="user.customLink04">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink05" target='_blank' rel='noreferrer' v-if="user.customLink05">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink06" target='_blank' rel='noreferrer' v-if="user.customLink06">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink07" target='_blank' rel='noreferrer' v-if="user.customLink07">
                      <i class='fab fa-globe-asia' />
                    </a>
                    <a :href="user.customLink08" target='_blank' rel='noreferrer' v-if="user.customLink08">
                      <i class='fab fa-globe-asia' />
                    </a>              
                </div>
              </div>
          </div>
          <div class='col m12 l8'>
           <div class='card border-bottom-highlight' v-if="user.bio && user.bio.length >0">
              <header>
                <i class='material-icons highlight'>person</i>
                {{resource.user_profile_bio}}
              </header>
              <p>{{user.bio}}</p>
            </div>

            <div class='card border-bottom-highlight' v-if="user.interests && user.interests.length >0">
              <header>
                <i class='material-icons highlight'>flash_on</i>
                {{resource.interests}}
              </header>
              <section class='row'>
                    <span class='col s4' v-for="(item,index) in user.interests" :key="index" >{{item}}</span>
              </section>
            </div>

            <div class='card border-bottom-highlight' v-if="user.achievements && user.achievements.length>0">
              <header>
                <i class='material-icons highlight'>beenhere</i>
                {{resource.achievements}}
              </header>
                 <section v-for="(achievement,index) in achievements" :key="index">
                    <h3>{{achievement.subject}}
                    <i v-if= "achievement.highlight" class='star highlight float-right' />
                    </h3>
                    <p class='description'>{{achievement.description}}</p>
                    <hr />
                  </section>;              
            </div>
          </div>
        </div>
      </form>
    </div>
</template>

<script lang="ts">
import { getResource, handleError, initForm, registerEvents, StringMap } from "uione";
import { Options, Vue } from "vue-class-component";
import imageOnline from '../assets/images/online.svg';
import { getMyProfileService, User } from "./user";

@Options({})
export default class UserPage extends Vue {
imageOnline = imageOnline;
user:User = {} as any;
form:any;
followers = '7 followers';
following = '10 following';
resource:StringMap;
created(){
    this.resource = getResource().resource();
}
mounted(){ 
    this.form = initForm(this.$refs.form as any, registerEvents);
    // const id = buildId(getMyProfileService.keys(), this.$route);
    const id = this.$route.params.id as string;
    getMyProfileService().getMyProfile(id).then(usr =>{
        this.user = usr;
    }).catch(handleError);
}
}
</script>

<style>

</style>