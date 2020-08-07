import { Service } from '@interfaces';

const init = async () => {
    return 'Use Nodemailer';
};

export default {
    name: 'mail',
    init,
} as Service;
