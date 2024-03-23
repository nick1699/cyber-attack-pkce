import { KeycloakService } from "keycloak-angular";
import {environment} from "../../../environments/environment";

export function initializeKeycloak(
  keycloak: KeycloakService
) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakBaseUrl,
        realm: 'cyber-attack',
        clientId: 'prepared-frontend',
      },
      initOptions: {
        checkLoginIframe: false,
      }
    });
}
