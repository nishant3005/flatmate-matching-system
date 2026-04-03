package com.app.flatmate.dto;

import com.app.flatmate.model.FoodPreference;
import com.app.flatmate.model.SleepCycle;
import com.app.flatmate.model.WorkType;

public class PreferenceRequest {
    private SleepCycle sleepCycle;
    private Integer cleanliness;
    private Boolean smoking;
    private Boolean drinking;
    private Integer budgetMin;
    private Integer budgetMax;
    private FoodPreference foodPreference;
    private WorkType workType;
    private Integer guestsFrequency;
    private String city;

    public SleepCycle getSleepCycle() { return sleepCycle; }
    public void setSleepCycle(SleepCycle sleepCycle) { this.sleepCycle = sleepCycle; }
    public Integer getCleanliness() { return cleanliness; }
    public void setCleanliness(Integer cleanliness) { this.cleanliness = cleanliness; }
    public Boolean getSmoking() { return smoking; }
    public void setSmoking(Boolean smoking) { this.smoking = smoking; }
    public Boolean getDrinking() { return drinking; }
    public void setDrinking(Boolean drinking) { this.drinking = drinking; }
    public Integer getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Integer budgetMin) { this.budgetMin = budgetMin; }
    public Integer getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Integer budgetMax) { this.budgetMax = budgetMax; }
    public FoodPreference getFoodPreference() { return foodPreference; }
    public void setFoodPreference(FoodPreference foodPreference) { this.foodPreference = foodPreference; }
    public WorkType getWorkType() { return workType; }
    public void setWorkType(WorkType workType) { this.workType = workType; }
    public Integer getGuestsFrequency() { return guestsFrequency; }
    public void setGuestsFrequency(Integer guestsFrequency) { this.guestsFrequency = guestsFrequency; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
