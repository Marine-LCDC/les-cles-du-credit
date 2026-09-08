export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AgentVerdict = "vert" | "orange" | "rouge";
export type TypeBien = "ancien" | "neuf";

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          email: string;
          duree_max_locative_marche: number;
          simulations_quota_mensuel: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string;
          subscription_current_period_end: string | null;
          subscription_price_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          duree_max_locative_marche?: number;
          simulations_quota_mensuel?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string;
          subscription_current_period_end?: string | null;
          subscription_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          duree_max_locative_marche?: number;
          simulations_quota_mensuel?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string;
          subscription_current_period_end?: string | null;
          subscription_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      biens: {
        Row: {
          id: string;
          agent_id: string;
          public_token: string;
          reference: string;
          nom_residence: string | null;
          adresse_complete: string;
          ville: string;
          prix_acquisition: number;
          type_bien: TypeBien;
          frais_acquisition: number;
          travaux_necessaires: boolean;
          travaux_montant: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          public_token?: string;
          reference: string;
          nom_residence?: string | null;
          adresse_complete: string;
          ville: string;
          prix_acquisition: number;
          type_bien: TypeBien;
          frais_acquisition: number;
          travaux_necessaires?: boolean;
          travaux_montant?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string;
          public_token?: string;
          reference?: string;
          nom_residence?: string | null;
          adresse_complete?: string;
          ville?: string;
          prix_acquisition?: number;
          type_bien?: TypeBien;
          frais_acquisition?: number;
          travaux_necessaires?: boolean;
          travaux_montant?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "biens_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
        ];
      };
      simulations: {
        Row: {
          id: string;
          bien_id: string;
          agent_id: string;
          dossier_ref: string;
          visiteur_prenom: string;
          visiteur_nom: string;
          visiteur_email: string | null;
          agent_verdict: AgentVerdict;
          created_at: string;
        };
        Insert: {
          id?: string;
          bien_id: string;
          agent_id: string;
          dossier_ref: string;
          visiteur_prenom: string;
          visiteur_nom: string;
          visiteur_email?: string | null;
          agent_verdict: AgentVerdict;
          created_at?: string;
        };
        Update: {
          id?: string;
          bien_id?: string;
          agent_id?: string;
          dossier_ref?: string;
          visiteur_prenom?: string;
          visiteur_nom?: string;
          visiteur_email?: string | null;
          agent_verdict?: AgentVerdict;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "simulations_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "simulations_bien_id_fkey";
            columns: ["bien_id"];
            isOneToOne: false;
            referencedRelation: "biens";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_bien_public: {
        Args: { p_token: string };
        Returns: Json;
      };
      enregistrer_simulation: {
        Args: {
          p_token: string;
          p_visiteur_prenom: string;
          p_visiteur_nom: string;
          p_visiteur_email: string;
          p_agent_verdict: string;
        };
        Returns: Json;
      };
      compteur_simulations_mois: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
