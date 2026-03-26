import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, Filter, ReceiptText, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { transactionService } from '../../services/transactionService';
import { downloadCSV } from '../../utils/exportUtils';

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getAllTransactions();
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const searchString = `${t.typeTransaction} ${t.statut} ${t.referenceId || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Transactions & Paiements</h2>
          <p className="text-slate-500 mt-1">Surveillez l'ensemble des flux financiers de la plateforme.</p>
        </div>
        <button onClick={fetchTransactions} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="flex items-center gap-4 p-5 border-l-4 border-emerald-500">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
               <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-medium text-slate-500">Total Contributions</p>
               <h3 className="text-2xl font-bold text-slate-800">
                  {transactions.filter(t => t.typeTransaction === 'CONTRIBUTION' && t.statut === 'COMPLETED').reduce((acc, curr) => acc + curr.montant, 0).toLocaleString()} FCFA
               </h3>
            </div>
         </Card>
         <Card className="flex items-center gap-4 p-5 border-l-4 border-blue-500">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
               <ArrowDownRight className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-medium text-slate-500">Total Retraits</p>
               <h3 className="text-2xl font-bold text-slate-800">
                  {transactions.filter(t => t.typeTransaction === 'RETRAIT' && t.statut === 'COMPLETED').reduce((acc, curr) => acc + curr.montant, 0).toLocaleString()} FCFA
               </h3>
            </div>
         </Card>
         <Card className="flex items-center gap-4 p-5 border-l-4 border-amber-500">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
               <ReceiptText className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-medium text-slate-500">Transactions en attente</p>
               <h3 className="text-2xl font-bold text-slate-800">
                  {transactions.filter(t => t.statut === 'PENDING').length} flux
               </h3>
            </div>
         </Card>
      </div>

      <Card className="p-0 overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par référence, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => downloadCSV(filteredTransactions, 'Liste_Transactions.csv')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Exporter CSV
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" /> Filrtres
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-6 py-4">Réf / Type</th>
                <th className="px-6 py-4">Utilisateur / Portefeuille</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Chargement...</td>
                 </tr>
              ) : filteredTransactions.length === 0 ? (
                 <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Aucune transaction recensée.</td>
                 </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{t.typeTransaction}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{t.referenceId || `TR-${t.id}`}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">Utilisateur #{t.utilisateurId}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Wallet #{t.walletId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold ${t.typeTransaction === 'CONTRIBUTION' ? 'text-emerald-600' : 'text-slate-800'}`}>
                         {t.typeTransaction === 'CONTRIBUTION' ? '+' : ''}{t.montant?.toLocaleString()} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={t.statut === 'COMPLETED' ? 'success' : t.statut === 'FAILED' || t.statut === 'CANCELLED' ? 'danger' : 'warning'}>
                        {t.statut}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(t.dateTransaction).toLocaleString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
