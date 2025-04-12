export interface Agent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  creator: string;
  vaultAddress: string;
  commission: string;
  imageUrl: string;
  createdAt: Date;
}
