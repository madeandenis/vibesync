import { UserContext } from 'typings/user.type';
import { User } from '../../users/entities/user.entity';

export function generateUserContext(user: User, accessToken: string, expires_in: number): UserContext {
    return {
        userIdentity : {
            id: user.id,
            id_3p: user.third_party_user_id,
            username: user.username,
            ip_address: user.ip_address,
        },
        authenticationDetails : {
            access_token: accessToken,
            expires_in: expires_in,
            auth_provider: user.third_party_provider
        },
        profileInformation : {
            profile_url: user.profile_url,
            avatar_url: user.avatar_url,
            country: user.country
        }
    }
}