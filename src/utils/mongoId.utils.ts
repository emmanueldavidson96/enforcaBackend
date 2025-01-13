import mongoose from "mongoose"

export const validateDbId = async(...idArr:string[]) => {
  idArr.forEach((id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid MongoDb Id");
    }
  });
};
