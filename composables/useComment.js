export default function useComment(aid, editApi, callback) {
  const addCommentId = async cid => {
    await editApi({ _id: aid, $push: { comments: cid } })
    callback && callback()
  }

  const deleteCommentId = async cid => {
    await editApi({ _id: aid, $pull: { comments: cid } })
    callback && callback()
  }

  return {
    addCommentId,
    deleteCommentId,
  }
}
