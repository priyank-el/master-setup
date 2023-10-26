import { Agenda } from 'agenda';
const config = require("config");
const User = require("../components/user/models/userModel");

const agenda = new Agenda({ db: { address: config.get("DB_CONN_STRING") } });

const setExpiredSubUser = async (user_id: any) => {
    try {
        console.log('setExpiredSubUser', user_id);
        const user_ = await User.findById(user_id);
        if (user_ && user_.isVerified === 0) {
            console.log('Delete user now', user_._id);
            await User.deleteOne({ _id: user_._id })
        }
    } catch (error) {
        console.log('expiredStatus2', error);
    }
}

agenda.define('subUserRegister',
    async (job: any) => {
        const { user_id } = job.attrs.data;
        await setExpiredSubUser(user_id)
    }
)

export default {
    agenda,
    setExpiredSubUser
};