import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { addInvestor } from "../utils/investorStorage";
import { CurrencyDollarIcon, ShieldCheckIcon, BriefcaseIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface InvestorForm {
  name: string;
  description: string;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentFocus: string[];
  maxInvestmentAmount: number;
  minInvestmentAmount: number;
}

const investmentFocusOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Energy',
  'Consumer Goods',
  'Industrial',
  'Materials',
];

export default function Create() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    getValues,
  } = useForm<InvestorForm>({
    mode: 'onChange',
    defaultValues: {
      riskTolerance: 'medium',
      minInvestmentAmount: 1000,
      maxInvestmentAmount: 10000
    }
  });

  const watchedFields = watch();

  useEffect(() => {
    // Calculate form completion progress
    const totalFields = 6; // name, description, risk, focus, min, max
    const completedFields = Object.keys(watchedFields).filter(key => {
      if (key === 'investmentFocus') {
        return Object.keys(watchedFields[key] || {}).length > 0;
      }
      return !!watchedFields[key];
    }).length;
    
    setFormProgress((completedFields / totalFields) * 100);
  }, [watchedFields]);

  const nextStep = async () => {
    const fields = formStep === 0 
      ? ['name', 'description'] 
      : ['riskTolerance', 'minInvestmentAmount', 'maxInvestmentAmount'];
    
    const isStepValid = await trigger(fields);
    if (isStepValid) {
      setFormStep(current => current + 1);
    }
  };

  const prevStep = () => {
    setFormStep(current => current - 1);
  };

  const onSubmit = async (data: InvestorForm) => {
    setIsSubmitting(true);
    try {
      // Save the investor to localStorage
      const investmentFocus = Object.entries(data.investmentFocus)
        .filter(([_, value]) => value)
        .map(([key]) => investmentFocusOptions[parseInt(key)]);
      
      const investor = addInvestor({
        ...data,
        investmentFocus,
      });
      
      toast.success('Investor created successfully!', {
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A'
        },
        icon: '🚀'
      });
      
      // Navigate to invest page
      router.push('/invest');
    } catch (error) {
      toast.error('Failed to create investor', {
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A'
        }
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-bold gradient-text">Create Investor</h1>
          <p className="text-gray-400">Define your investment profile and preferences</p>
        </div>

        <div className="mb-6">
          <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] transition-all duration-500 ease-in-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Profile Details</span>
            <span>Investment Parameters</span>
            <span>Review & Create</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] gradient-border">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/5 to-[#00D9F5]/5" />
          <div className="relative p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {formStep === 0 && (
                <div className="space-y-6 animate-float">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Investor Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className="block w-full rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] px-4 py-3 text-white focus:border-[#00F5A0] focus:ring focus:ring-[#00F5A0]/20 sm:text-sm transition-all duration-200"
                        placeholder="Enter investor name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Description
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                      <textarea
                        id="description"
                        rows={4}
                        {...register('description', {
                          required: 'Description is required',
                        })}
                        className="block w-full rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] px-4 py-3 text-white focus:border-[#00F5A0] focus:ring focus:ring-[#00F5A0]/20 sm:text-sm transition-all duration-200"
                        placeholder="Describe this investor's strategy and goals"
                      />
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] hover:from-[#00D9F5] hover:to-[#00F5A0] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:ring-offset-2 disabled:opacity-50"
                    >
                      <span>Next Step</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {formStep === 1 && (
                <div className="space-y-6 animate-float">
                  <div>
                    <label
                      htmlFor="riskTolerance"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Risk Tolerance
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['low', 'medium', 'high'].map((risk) => (
                        <div
                          key={risk}
                          className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
                            watch('riskTolerance') === risk
                              ? `${getRiskColor(risk)} border-2 shadow-md shadow-${risk === 'low' ? 'green' : risk === 'medium' ? 'yellow' : 'red'}-500/10`
                              : 'border-[#3A3A3A] hover:border-[#4A4A4A] bg-[#2A2A2A]'
                          } p-4 flex flex-col items-center`}
                          onClick={() => setValue('riskTolerance', risk as 'low' | 'medium' | 'high', { shouldValidate: true })}
                        >
                          <ShieldCheckIcon className={`h-8 w-8 mb-2 ${
                            risk === 'low' ? 'text-green-400' : 
                            risk === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }`} />
                          <span className="capitalize font-medium">
                            {risk}
                          </span>
                          <span className="text-xs text-gray-400 mt-1 text-center">
                            {risk === 'low' 
                              ? 'Conservative investments' 
                              : risk === 'medium' 
                                ? 'Balanced approach' 
                                : 'Aggressive growth'}
                          </span>
                          <input
                            type="radio"
                            id={`risk-${risk}`}
                            value={risk}
                            {...register('riskTolerance')}
                            className="sr-only"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Investment Focus
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {investmentFocusOptions.map((option, index) => (
                        <div
                          key={option}
                          className={`relative rounded-lg border border-[#3A3A3A] hover:border-[#4A4A4A] bg-[#2A2A2A] p-3 cursor-pointer transition-all duration-200 ${
                            watch(`investmentFocus.${index}`) ? 'bg-[#2A2A2A] border-[#00F5A0]' : ''
                          }`}
                          onClick={() => {
                            const currentValue = getValues(`investmentFocus.${index}`);
                            setValue(`investmentFocus.${index}`, !currentValue);
                          }}
                        >
                          <div className="flex items-start">
                            <div className={`h-4 w-4 rounded border border-[#4A4A4A] flex items-center justify-center mr-2 mt-0.5 ${
                              watch(`investmentFocus.${index}`) ? 'bg-[#00F5A0] border-[#00F5A0]' : ''
                            }`}>
                              {watch(`investmentFocus.${index}`) && (
                                <svg className="h-3 w-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-sm">
                                {option}
                              </span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            id={option}
                            value={index}
                            {...register(`investmentFocus.${index}`)}
                            className="sr-only"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label
                        htmlFor="minInvestmentAmount"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Minimum Investment ($)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                        <div className="relative rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] focus-within:border-[#00F5A0] focus-within:ring focus-within:ring-[#00F5A0]/20 transition-all duration-200">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id="minInvestmentAmount"
                            {...register('minInvestmentAmount', {
                              required: 'Minimum amount is required',
                              min: { value: 0, message: 'Amount must be positive' },
                            })}
                            className="block w-full rounded-lg bg-transparent border-0 py-3 pl-10 text-white focus:ring-0 sm:text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      {errors.minInvestmentAmount && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.minInvestmentAmount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="maxInvestmentAmount"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Maximum Investment ($)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/20 to-[#00D9F5]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                        <div className="relative rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] focus-within:border-[#00F5A0] focus-within:ring focus-within:ring-[#00F5A0]/20 transition-all duration-200">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id="maxInvestmentAmount"
                            {...register('maxInvestmentAmount', {
                              required: 'Maximum amount is required',
                              min: { value: 0, message: 'Amount must be positive' },
                              validate: (value) =>
                                value >= watch('minInvestmentAmount') ||
                                'Maximum amount must be greater than minimum amount',
                            })}
                            className="block w-full rounded-lg bg-transparent border-0 py-3 pl-10 text-white focus:ring-0 sm:text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      {errors.maxInvestmentAmount && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.maxInvestmentAmount.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#00F5A0] border border-[#3A3A3A]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] hover:from-[#00D9F5] hover:to-[#00F5A0] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Investor'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
