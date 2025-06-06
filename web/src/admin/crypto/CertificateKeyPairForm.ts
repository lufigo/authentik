import { DEFAULT_CONFIG } from "@goauthentik/common/api/config";
import "@goauthentik/elements/CodeMirror";
import "@goauthentik/elements/forms/HorizontalFormElement";
import { ModelForm } from "@goauthentik/elements/forms/ModelForm";

import { msg } from "@lit/localize";
import { TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { CertificateKeyPair, CertificateKeyPairRequest, CryptoApi } from "@goauthentik/api";

@customElement("ak-crypto-certificate-form")
export class CertificateKeyPairForm extends ModelForm<CertificateKeyPair, string> {
    loadInstance(pk: string): Promise<CertificateKeyPair> {
        return new CryptoApi(DEFAULT_CONFIG).cryptoCertificatekeypairsRetrieve({
            kpUuid: pk,
        });
    }

    getSuccessMessage(): string {
        return this.instance
            ? msg("Successfully updated certificate-key pair.")
            : msg("Successfully created certificate-key pair.");
    }

    async send(data: CertificateKeyPair): Promise<CertificateKeyPair> {
        if (this.instance) {
            return new CryptoApi(DEFAULT_CONFIG).cryptoCertificatekeypairsPartialUpdate({
                kpUuid: this.instance.pk || "",
                patchedCertificateKeyPairRequest: data,
            });
        }
        return new CryptoApi(DEFAULT_CONFIG).cryptoCertificatekeypairsCreate({
            certificateKeyPairRequest: data as unknown as CertificateKeyPairRequest,
        });
    }

    renderForm(): TemplateResult {
        return html` <ak-form-element-horizontal label=${msg("Name")} name="name" ?required=${true}>
                <input
                    type="text"
                    value="${ifDefined(this.instance?.name)}"
                    class="pf-c-form-control"
                    required
                />
            </ak-form-element-horizontal>
            <ak-form-element-horizontal
                label=${msg("Certificate")}
                name="certificateData"
                ?writeOnly=${this.instance !== undefined}
                ?required=${true}
            >
                <textarea
                    autocomplete="off"
                    spellcheck="false"
                    class="pf-c-form-control pf-m-monospace"
                    placeholder="-----BEGIN CERTIFICATE-----"
                    required
                ></textarea>
                <p class="pf-c-form__helper-text">${msg("PEM-encoded Certificate data.")}</p>
            </ak-form-element-horizontal>
            <ak-form-element-horizontal
                name="keyData"
                ?writeOnly=${this.instance !== undefined}
                label=${msg("Private Key")}
            >
                <textarea
                    autocomplete="off"
                    class="pf-c-form-control pf-m-monospace"
                    spellcheck="false"
                ></textarea>
                <p class="pf-c-form__helper-text">
                    ${msg(
                        "Optional Private Key. If this is set, you can use this keypair for encryption.",
                    )}
                </p>
            </ak-form-element-horizontal>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-crypto-certificate-form": CertificateKeyPairForm;
    }
}
