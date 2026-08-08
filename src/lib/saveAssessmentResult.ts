import { supabase, isSupabaseConfigured } from './supabase';

interface SaveAssessmentResultParams {
  testType: string;
  result: string;
}

export async function saveAssessmentResult({
  testType,
  result,
}: SaveAssessmentResultParams) {
  if (!isSupabaseConfigured) {
    console.log('Supabase is not configured. Result not saved remotely.');
    return {
      success: false,
      reason: 'not_configured',
    };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('User is not logged in. Result not saved.');
      return {
        success: false,
        reason: 'not_logged_in',
      };
    }

    const { error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: user.id,
        test_type: testType,
        result,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving assessment result:', error);
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error saving assessment result:', err);
    return {
      success: false,
      error: err,
    };
  }
}