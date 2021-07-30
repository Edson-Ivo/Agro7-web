const extractYoutubeVideoID = url => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);

  return match ? match[7] : '';
};

export default extractYoutubeVideoID;
