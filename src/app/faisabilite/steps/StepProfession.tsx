"use client";

import { MoneyField, SelectField, Toggle, InfoBanner } from "../components/fields";
import {
  MATURITE_OPTIONS,
  PROFIL_OPTIONS,
  profilBesoinMaturite,
  type RevenuProForm,
  type WizardState,
} from "../wizard-state";
import type { MaturiteActivite, ProfilProfessionnel } from "@/lib/moteur";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

function BlocRevenu({
  titre,
  value,
  onChange,
}: {
  titre: string;
  value: RevenuProForm;
  onChange: (v: RevenuProForm) => void;
}) {
  const besoinMaturite = profilBesoinMaturite(value.profil);
  const maturiteOkTroisAns = value.maturiteActivite === "trois_ans_ou_plus";
  const showTraj =
    besoinMaturite && value.utiliserTrajectoire && maturiteOkTroisAns;
  const historiqueCourt =
    besoinMaturite &&
    (value.maturiteActivite === "moins_1_an" ||
      value.maturiteActivite === "un_a_deux_ans");

  return (
    <div className="mb-6 rounded-[16px] border border-[#e6dcc8] bg-white/70 p-4">
      <p className="mb-3 text-sm font-medium text-neutral">{titre}</p>

      <SelectField<ProfilProfessionnel>
        label="Situation professionnelle"
        value={value.profil}
        onChange={(profil) =>
          onChange({
            ...value,
            profil,
            maturiteActivite: profilBesoinMaturite(profil)
              ? value.maturiteActivite
              : "",
            utiliserTrajectoire: profilBesoinMaturite(profil)
              ? value.utiliserTrajectoire
              : false,
          })
        }
        options={PROFIL_OPTIONS}
      />

      {value.profil === "cdi_periode_essai" ? (
        <InfoBanner>
          Un CDI en période d&apos;essai est pris en compte avec prudence. Si ce
          revenu est indispensable au financement, le résultat pourra être
          « Visite possible » le temps d&apos;une validation bancaire.
        </InfoBanner>
      ) : null}

      {besoinMaturite ? (
        <>
          <SelectField<MaturiteActivite | "">
            label="Depuis combien de temps cette activité ?"
            value={value.maturiteActivite}
            onChange={(maturiteActivite) =>
              onChange({
                ...value,
                maturiteActivite,
                utiliserTrajectoire:
                  maturiteActivite === "trois_ans_ou_plus"
                    ? value.utiliserTrajectoire
                    : false,
              })
            }
            options={[
              { value: "", label: "Choisir…" },
              ...MATURITE_OPTIONS,
            ]}
          />

          {historiqueCourt ? (
            <InfoBanner>
              Avec un historique court, ce revenu est pris en compte avec
              prudence. S&apos;il est indispensable au financement, le résultat
              pourra être « Visite possible ».
            </InfoBanner>
          ) : null}

          {maturiteOkTroisAns ? (
            <Toggle
              label="Renseigner les 3 derniers exercices"
              checked={value.utiliserTrajectoire}
              onChange={(utiliserTrajectoire) =>
                onChange({ ...value, utiliserTrajectoire })
              }
              hint="Optionnel — affine la trajectoire (hausse / baisse). Sinon, indiquez un montant moyen."
            />
          ) : null}
        </>
      ) : null}

      {showTraj ? (
        <>
          <MoneyField
            label="Exercice N-2 (annuel)"
            value={value.nMoins2}
            onChange={(nMoins2) => onChange({ ...value, nMoins2 })}
            hint="CA ou revenu annuel selon votre statut"
          />
          <MoneyField
            label="Exercice N-1 (annuel)"
            value={value.nMoins1}
            onChange={(nMoins1) => onChange({ ...value, nMoins1 })}
          />
          <MoneyField
            label="Exercice N (annuel)"
            value={value.n}
            onChange={(n) => onChange({ ...value, n })}
          />
        </>
      ) : (
        <MoneyField
          label={
            value.profil.startsWith("micro_")
              ? "Chiffre d'affaires mensuel moyen"
              : besoinMaturite
                ? "Revenu mensuel moyen"
                : "Revenu mensuel net"
          }
          value={value.montantMensuel}
          onChange={(montantMensuel) => onChange({ ...value, montantMensuel })}
          hint={
            value.profil.startsWith("micro_")
              ? "Un taux de retenue prudent sera appliqué selon votre activité"
              : besoinMaturite
                ? "Moyenne de référence de votre activité"
                : "Net imposable ou pension nette"
          }
        />
      )}
    </div>
  );
}

export function StepProfession({ state, patch }: Props) {
  const showCo =
    state.coEmprunt || state.regime === "marie_communaute";

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Situation professionnelle
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Chaque revenu est analysé séparément — encore environ 2 minutes.
      </p>

      <BlocRevenu
        titre={
          state.e1.prenom
            ? `${state.e1.prenom} — emprunteur`
            : "Emprunteur 1"
        }
        value={state.revenuE1}
        onChange={(revenuE1) => patch({ revenuE1 })}
      />

      {showCo ? (
        <BlocRevenu
          titre={
            state.e2.prenom
              ? `${state.e2.prenom} — co-emprunteur`
              : "Co-emprunteur"
          }
          value={state.revenuE2}
          onChange={(revenuE2) => patch({ revenuE2 })}
        />
      ) : null}
    </div>
  );
}
