
import { getBenefitById } from '@/server/services/mpartner/benefit.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Ticket } from 'lucide-react';
import BenefitDetail from '../components/detail';
import { getCurrentUser } from '@/lib/auth';

interface BenefitDetailPageProps {
  params: {
    id: string
  }
}

export default async function BenefitDetailPage({ params }: BenefitDetailPageProps) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser()
    const benefit = user?.email ? await getBenefitById(resolvedParams.id, user.email) : null
    
    if (!benefit) {
      return (
        <NotFoundPage />
      )
    }

    return <BenefitDetail data={benefit} />
  } catch (error) {
    console.error('Error fetching benefit:', error)
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/30">
              <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading this benefit. Please try again later.
          </p>
          <Button asChild variant="default" className="gap-2">
            <Link href="/benefits">
              <Ticket size={16} />
              Back to Benefits
            </Link>
          </Button>
        </Card>
      </div>
    )
  }
}

function NotFoundPage () {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/30">
                <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Benefit Not Found
            </h1>
            <p className="text-muted-foreground">
              The benefit you're looking for doesn't exist or has been removed.
            </p>
            <span className='mb-6 text-foreground text-sm'>
                Please inform us if you think this is a mistake.
            </span>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" className="gap-2">
                <Link href="/benefits">
                  <Ticket size={16} />
                  Browse All Benefits
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <ArrowLeft size={16} />
                  Go Home
                </Link>
              </Button>
            </div>
          </Card>
        </div>
    )
}