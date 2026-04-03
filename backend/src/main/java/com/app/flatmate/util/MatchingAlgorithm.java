package com.app.flatmate.util;

import com.app.flatmate.model.Preference;

import java.util.List;

public class MatchingAlgorithm {

    private static final double WEIGHT_SLEEP       = 0.20;
    private static final double WEIGHT_CLEANLINESS = 0.20;
    private static final double WEIGHT_BUDGET      = 0.25;
    private static final double WEIGHT_HABITS      = 0.20;
    private static final double WEIGHT_OTHERS      = 0.15;

    /** Returns final score 0-100 and populates reasons list. */
    public static double computeScore(Preference a, Preference b, List<String> reasons) {
        double sleep       = scoreSleep(a, b, reasons);
        double cleanliness = scoreCleanliness(a, b, reasons);
        double budget      = scoreBudget(a, b, reasons);
        double habits      = scoreHabits(a, b, reasons);
        double others      = scoreOthers(a, b, reasons);

        double raw = WEIGHT_SLEEP * sleep
                   + WEIGHT_CLEANLINESS * cleanliness
                   + WEIGHT_BUDGET * budget
                   + WEIGHT_HABITS * habits
                   + WEIGHT_OTHERS * others;

        return Math.round(raw * 1000.0) / 10.0; // 1 decimal, 0-100
    }

    private static double scoreSleep(Preference a, Preference b, List<String> r) {
        if (a.getSleepCycle() == null || b.getSleepCycle() == null) return 0.5;
        if (a.getSleepCycle() == b.getSleepCycle()) {
            r.add("Same sleep cycle (" + label(a.getSleepCycle().name()) + ")");
            return 1.0;
        }
        r.add("Different sleep cycles");
        return 0.0;
    }

    private static double scoreCleanliness(Preference a, Preference b, List<String> r) {
        if (a.getCleanliness() == null || b.getCleanliness() == null) return 0.5;
        int diff = Math.abs(a.getCleanliness() - b.getCleanliness());
        double score = 1.0 - (diff / 5.0);
        if (diff == 0)      r.add("Same cleanliness standard (" + a.getCleanliness() + "/5)");
        else if (diff <= 1) r.add("Similar cleanliness levels");
        else if (diff >= 3) r.add("Different cleanliness standards (gap: " + diff + "/5)");
        return Math.max(0, score);
    }

    private static double scoreBudget(Preference a, Preference b, List<String> r) {
        if (a.getBudgetMin() == null || b.getBudgetMin() == null) return 0.5;
        int oStart = Math.max(a.getBudgetMin(), b.getBudgetMin());
        int oEnd   = Math.min(a.getBudgetMax(), b.getBudgetMax());
        int overlap = Math.max(0, oEnd - oStart);
        int maxRange = Math.max(
                Math.max(a.getBudgetMax() - a.getBudgetMin(), b.getBudgetMax() - b.getBudgetMin()), 1);
        double score = Math.min(1.0, (double) overlap / maxRange);
        if (overlap > 0) r.add("Budget overlaps ₹" + oStart + "–₹" + oEnd);
        else             r.add("No budget overlap");
        return score;
    }

    private static double scoreHabits(Preference a, Preference b, List<String> r) {
        double s = 1.0, d = 1.0;
        if (a.getSmoking() != null && b.getSmoking() != null) {
            if (a.getSmoking().equals(b.getSmoking())) r.add("Same smoking preference");
            else { r.add("Smoking preference mismatch"); s = 0.0; }
        }
        if (a.getDrinking() != null && b.getDrinking() != null) {
            if (a.getDrinking().equals(b.getDrinking())) r.add("Same drinking preference");
            else { r.add("Drinking preference mismatch"); d = 0.0; }
        }
        return (s + d) / 2.0;
    }

    private static double scoreOthers(Preference a, Preference b, List<String> r) {
        double food = 0.5, work = 0.5, guests = 0.5;

        if (a.getFoodPreference() != null && b.getFoodPreference() != null) {
            boolean match = a.getFoodPreference() == b.getFoodPreference()
                    || a.getFoodPreference().name().equals("ANY")
                    || b.getFoodPreference().name().equals("ANY");
            food = match ? 1.0 : 0.0;
            if (match) r.add("Compatible food preferences");
            else       r.add("Different food preferences");
        }

        if (a.getWorkType() != null && b.getWorkType() != null) {
            work = a.getWorkType() == b.getWorkType() ? 1.0 : 0.4;
            if (a.getWorkType() == b.getWorkType())
                r.add("Same work type (" + label(a.getWorkType().name()) + ")");
        }

        if (a.getGuestsFrequency() != null && b.getGuestsFrequency() != null) {
            int diff = Math.abs(a.getGuestsFrequency() - b.getGuestsFrequency());
            guests = 1.0 - (diff / 5.0);
            if (diff <= 1)      r.add("Similar guest frequency preference");
            else if (diff >= 3) r.add("Very different guest tolerance");
        }

        return (food + work + guests) / 3.0;
    }

    private static String label(String enumName) {
        String lower = enumName.replace("_", " ").toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
