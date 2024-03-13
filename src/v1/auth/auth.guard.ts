import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(/* Inject mongoose user model to use it for client validation in 'canActivate' method below*/) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];

    if (!apiKey) {
      //throw new UnauthorizedException();
    }

    try {
      const user = await new Promise((resolve) => {
        resolve('user');
      });

      console.log('user ', user);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
