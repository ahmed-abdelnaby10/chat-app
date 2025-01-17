import express from 'express'
import { registerController } from '../controllers/users/auth/register.controller.js'
import { loginController } from '../controllers/users/auth/login.controller.js'
import { getAllUsersController, getOneUser } from '../controllers/users/getUsers.controller.js'
import { authVerification } from '../middlewares/verifyAuth.middleware.js'
import { changePasswordController, deleteUserController, updateUserController } from '../controllers/users/users.controller.js'
import uploadImage from "../middlewares/uploadImage.middleware.js"
import { removeFriendController } from '../controllers/users/friends.controller.js'
import { acceptFriendRequestController, cancelFriendRequestController, rejectFriendRequestController, sendFriendRequestController } from '../controllers/users/friendRequests.controller.js'

const router = express.Router()

router.route('/users')
    .get(authVerification, getAllUsersController)

router.route('/register')
    .post(registerController)

router.route('/login')
    .post(loginController)  

router.route('/users/:userId')
    .get(authVerification, getOneUser)
    .delete(authVerification, deleteUserController)
    .patch(authVerification, uploadImage().single('media'), updateUserController)

router.route('/users/:userId/change-password')
    .patch(authVerification, changePasswordController);

router.route('/:userId/send-friend-request')
    .patch(authVerification, sendFriendRequestController);

router.route('/:userId/accept-friend-request')
    .patch(authVerification, acceptFriendRequestController);

router.route('/:userId/reject-friend-request')
    .patch(authVerification, rejectFriendRequestController);

router.route('/:userId/cancel-friend-request')
    .patch(authVerification, cancelFriendRequestController);
    
router.route('/:userId/remove-friend')
        .patch(authVerification, removeFriendController);

export default router