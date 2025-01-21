import Joi from "joi"

export const createChatSchema = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string(),
  groupId: Joi.string(),
  message: Joi.string(),
  date: Joi.date(),
}).xor('receiverId', 'groupId'); // Must have either receiverId or groupId, but not both

export const createGroupSchema = Joi.object({
  name: Joi.string().required(),
  members: Joi.array().items(Joi.string()).required(),
});

export const joinGroupSchema = Joi.object({
  userId: Joi.string().required(),
  groupId: Joi.string().required(),
});