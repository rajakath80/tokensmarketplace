import { createCampaign } from "./actions/createCampaign";

const paths = {
  home() {
    return '/';
  },
  dashboard() { 
    return `/dashboard`;
  },
  createCampaign() {
    return `/campaign`;
  },
  showCampaign(id: string) {
    return `/campaign/${id}`;
  },
  showCampaignRequests(id: string) {
    return `/campaign/${id}/requests`;
  },
  createCampaignRequests(id: string) {
    return `/campaign/${id}/requests/new`;
  },
  // postCreate(topicSlug: string) {
  //   return `/topics/${topicSlug}/posts/new`;
  // },
  // postShow(topicSlug: string, postId: string) {
  //   return `/topics/${topicSlug}/posts/${postId}`;
  // },
  // goalShow(goalSlug: string) {
  //   return `/goals/${goalSlug}`;
  // },
  // deleteGoal(goalId: string) {
  //   return `/goals/${goalId}/delete`;
  // },
};

export default paths;